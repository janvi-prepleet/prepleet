\set ON_ERROR_STOP on
begin;

do $$
begin
  assert (select count(*) from public.domains) = 2, 'Expected two domains';
  assert (select count(*) from public.case_types) = 9, 'Expected nine case types';
  assert (select count(*) from public.case_domain_mapping) = 10, 'Expected ten memberships';
  assert (select count(*) from public.case_types where name = 'Guesstimate') = 1,
    'Guesstimate must be a single shared case type';
  assert (select array_agg(d.name order by d.name)
    from public.case_domain_mapping m
    join public.case_types t on t.id = m.case_type_id
    join public.domains d on d.id = m.domain_id
    where t.name = 'Guesstimate') = array['Consulting', 'Product Management'],
    'Guesstimate must belong to both domains';

  assert (select array_agg(t.name order by t.sort_order)
    from public.case_domain_mapping m
    join public.case_types t on t.id = m.case_type_id
    join public.domains d on d.id = m.domain_id
    where d.name = 'Consulting') = array[
      'Guesstimate', 'Profitability', 'Pricing Strategy', 'Market Entry', 'M&A', 'Go-to-Market'
    ], 'Consulting membership/order differs from UI';
  assert (select array_agg(t.name order by t.sort_order)
    from public.case_domain_mapping m
    join public.case_types t on t.id = m.case_type_id
    join public.domains d on d.id = m.domain_id
    where d.name = 'Product Management') = array[
      'Guesstimate', 'Product Design', 'Metric Cases', 'RCA Cases'
    ], 'Product Management membership/order differs from UI';

  begin
    insert into public.domains (name) values ('Consulting');
    raise exception 'Duplicate domain accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into public.domains (name) values ('   ');
    raise exception 'Blank domain accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.case_types (name, slug) values ('Another type', 'guesstimate');
    raise exception 'Duplicate slug accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into public.case_types (name, slug) values ('Guesstimate', 'another-slug');
    raise exception 'Duplicate type name accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into public.case_types (name, slug) values ('Bad slug', 'Bad Slug');
    raise exception 'Invalid slug accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.case_types (name, slug, sort_order) values ('Bad order', 'bad-order', -1);
    raise exception 'Negative sort order accepted';
  exception when check_violation then null;
  end;
  begin
    insert into public.case_domain_mapping select * from public.case_domain_mapping limit 1;
    raise exception 'Duplicate membership accepted';
  exception when unique_violation then null;
  end;
  begin
    insert into public.case_domain_mapping (case_type_id, domain_id)
      values (gen_random_uuid(), '00000000-0000-4000-8000-000000000001');
    raise exception 'Missing case type accepted';
  exception when foreign_key_violation then null;
  end;
  begin
    insert into public.case_domain_mapping (case_type_id, domain_id)
      values ('00000000-0000-4000-8000-000000000101', gen_random_uuid());
    raise exception 'Missing domain accepted';
  exception when foreign_key_violation then null;
  end;
  begin
    delete from public.case_types where slug = 'guesstimate';
    raise exception 'Referenced case type deleted';
  exception when foreign_key_violation then null;
  end;
  begin
    delete from public.domains where name = 'Consulting';
    raise exception 'Referenced domain deleted';
  exception when foreign_key_violation then null;
  end;
end $$;

-- Exercise actual browser roles, not only catalog permissions as an owner.
do $$
declare
  browser_role text;
  table_name text;
  total bigint;
begin
  foreach browser_role in array array['anon', 'authenticated'] loop
    foreach table_name in array array['domains', 'case_types', 'case_domain_mapping'] loop
      assert (select relrowsecurity from pg_class
        where oid = format('public.%I', table_name)::regclass), 'RLS is disabled';
      assert not has_table_privilege(browser_role, 'public.' || table_name, 'INSERT'),
        'Unexpected browser INSERT grant';
      assert not has_table_privilege(browser_role, 'public.' || table_name, 'UPDATE'),
        'Unexpected browser UPDATE grant';
      assert not has_table_privilege(browser_role, 'public.' || table_name, 'DELETE'),
        'Unexpected browser DELETE grant';

      execute format('set local role %I', browser_role);
      execute format('select count(*) from public.%I', table_name) into total;
      assert total > 0, 'Browser cannot read taxonomy';
      begin
        execute format('insert into public.%I select * from public.%I limit 1', table_name, table_name);
        raise exception 'Browser INSERT succeeded';
      exception when insufficient_privilege then null;
      end;
      begin
        execute format('update public.%I set %I = %I', table_name,
          case when table_name = 'case_domain_mapping' then 'domain_id' else 'id' end,
          case when table_name = 'case_domain_mapping' then 'domain_id' else 'id' end);
        raise exception 'Browser UPDATE succeeded';
      exception when insufficient_privilege then null;
      end;
      begin
        execute format('delete from public.%I', table_name);
        raise exception 'Browser DELETE succeeded';
      exception when insufficient_privilege then null;
      end;
      reset role;
    end loop;
  end loop;
end $$;

-- Prove the policy layer also blocks writes if table privileges are broadened.
grant insert, update, delete on public.domains to anon, authenticated;
do $$
declare
  browser_role text;
  changed bigint;
begin
  foreach browser_role in array array['anon', 'authenticated'] loop
    execute format('set local role %I', browser_role);
    begin
      insert into public.domains (name) values ('Unauthorized domain');
      raise exception 'RLS allowed browser INSERT';
    exception when insufficient_privilege then null;
    end;
    update public.domains set name = 'Unauthorized domain' where name = 'Consulting';
    get diagnostics changed = row_count;
    assert changed = 0, 'RLS allowed browser UPDATE';
    delete from public.domains;
    get diagnostics changed = row_count;
    assert changed = 0, 'RLS allowed browser DELETE';
    reset role;
  end loop;
end $$;

rollback;
\echo 'PASS: taxonomy membership, constraints, browser grants and RLS'
