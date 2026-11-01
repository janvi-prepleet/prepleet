\set ON_ERROR_STOP on
begin;

insert into auth.users (id, raw_user_meta_data) values
  ('10000000-0000-4000-8000-000000000001', '{"full_name":"Reader One","username":"admin","college":"injected"}'),
  ('10000000-0000-4000-8000-000000000002', '{"full_name":"Reader Two"}');

insert into public.guides (id, slug, case_type_id, guide_type, title, level, read_minutes, content_path, status, domain_id) values
  ('00000000-0000-4000-8000-000000000901', 'draft-guide', '00000000-0000-4000-8000-000000000101', 'concepts', 'Draft', 'Easy', 3, 'draft.md', 'draft', null),
  ('00000000-0000-4000-8000-000000000902', 'archived-guide', '00000000-0000-4000-8000-000000000101', 'concepts', 'Archived', 'Easy', 3, 'archived.md', 'archived', null),
  ('00000000-0000-4000-8000-000000000903', 'product-guide', '00000000-0000-4000-8000-000000000101', 'concepts', 'Product only', 'Easy', 3, 'product.md', 'published', '00000000-0000-4000-8000-000000000002');

do $$
begin
  assert (select name = 'Member' from public.profiles where id = '10000000-0000-4000-8000-000000000003'), 'Existing identity was not backfilled';
  assert (select name = 'Reader One' and username = 'member_10000000000040008000000000000001'
    and college is null from public.profiles where id = '10000000-0000-4000-8000-000000000001'),
    'Signup metadata overrode a protected profile field';
  assert (select count(distinct guide_type) from public.guides) = 4, 'Four guide kinds required';
  begin
    insert into public.guides (slug, case_type_id, domain_id, guide_type, title, level, read_minutes, content_path)
    values ('invalid-domain', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000002', 'concepts', 'Invalid', 'Easy', 3, 'example.md');
    raise exception 'Accepted a Consulting-only type in Product domain';
  exception when foreign_key_violation then null;
  end;
end $$;

set local role anon;
do $$
begin
  assert (select count(*) from public.guides) = 5, 'Draft or archived content leaked';
  assert (select count(*) from public.guides where domain_id is null
    or domain_id = '00000000-0000-4000-8000-000000000001') = 4, 'Consulting shared-guide filter failed';
  assert (select count(*) from public.guides where domain_id is null
    or domain_id = '00000000-0000-4000-8000-000000000002') = 5, 'Product shared-guide filter failed';
  begin
    perform * from public.profiles;
    raise exception 'Anonymous private profile read succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body) values
      ('00000000-0000-4000-8000-000000000203','10000000-0000-4000-8000-000000000001','Anonymous');
    raise exception 'Anonymous comment accepted';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000001';
set local role authenticated;
insert into public.comments (guide_id,user_id,body) values
  ('00000000-0000-4000-8000-000000000203',auth.uid(),'My first comment');
do $$
begin
  assert (select count(*) from public.profiles) = 1, 'Other user profile leaked';
  assert (select count(*) from public.comments) = 1, 'Comment did not persist';
  begin
    insert into public.comments (guide_id,user_id,body) values
      ('00000000-0000-4000-8000-000000000203','10000000-0000-4000-8000-000000000002','Impersonation');
    raise exception 'Impersonation accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body) values
      ('00000000-0000-4000-8000-000000000901',auth.uid(),'Draft comment');
    raise exception 'Comment on a draft accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body) values
      ('00000000-0000-4000-8000-000000000203',auth.uid(),'  ');
    raise exception 'Blank body accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body) values
      ('00000000-0000-4000-8000-000000000203',auth.uid(),repeat('x',2001));
    raise exception 'Oversized body accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body,status) values
      ('00000000-0000-4000-8000-000000000203',auth.uid(),'Hidden','hidden');
    raise exception 'Client changed moderation state';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.comments set body='Edited by client';
    raise exception 'Unsupported client editing succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.comments;
    raise exception 'Unsupported client deletion succeeded';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local request.jwt.claim.sub = '10000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$
begin
  assert (select count(*) from public.profiles where name='Reader One') = 0,
    'User Two read User One private profile';
  assert (select count(*) from public.comment_authors where name='Reader One') = 1,
    'Safe public author projection unavailable';
end $$;
reset role;

do $$
begin
  assert (select array_agg(column_name::text order by ordinal_position)
    from information_schema.columns where table_schema='public' and table_name='comment_authors')
    = array['id','name','username','icon'], 'Public author view contains private fields';
  begin
    insert into public.comments (user_id,body) values ('10000000-0000-4000-8000-000000000001','No target');
    raise exception 'Targetless comment accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.comments (guide_id,user_id,body,parent_id)
    select '00000000-0000-4000-8000-000000000202',user_id,'Cross-guide reply',id from public.comments limit 1;
    raise exception 'Cross-guide parent accepted';
  exception when check_violation then null;
  end;
end $$;

update public.comments set status='hidden';
set local role anon;
do $$ begin
  assert (select count(*) from public.comments) = 0, 'Hidden comments leaked';
  assert (select count(*) from public.comment_authors) = 0, 'Hidden-only authors leaked';
end $$;
reset role;
update public.comments set status='visible',deleted_at=now();
set local role anon;
do $$ begin assert (select count(*) from public.comments)=0,'Deleted comment leaked'; end $$;
reset role;
update public.comments set deleted_at=null;
update public.guides set status='archived' where slug='cabs-in-mumbai';
set local role anon;
do $$ begin
  assert (select count(*) from public.comments)=0,'Archived guide comments leaked';
  assert (select count(*) from public.comment_authors)=0,'Archived-only author leaked';
end $$;
reset role;

rollback;
\echo 'PASS: Google profile creation, shared guides, publication access, comment identity and moderation'
