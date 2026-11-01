create type public.guide_kind as enum ('hurry', 'concepts', 'solved', 'patterns');
create type public.content_level as enum ('Easy', 'Medium', 'Hard');
create type public.publication_status as enum ('draft', 'published', 'archived');
create type public.comment_status as enum ('visible', 'hidden');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete restrict,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  username text not null unique check (username ~ '^[a-z0-9_]{3,50}$'),
  college text,
  degree text,
  latest_company text,
  latest_role text,
  years_exp numeric(4,1) check (years_exp >= 0),
  year_of_birth integer check (year_of_birth between 1900 and 2100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  icon text
);

create table public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  case_type_id uuid not null references public.case_types (id) on delete restrict,
  domain_id uuid references public.domains (id) on delete restrict,
  guide_type public.guide_kind not null,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  level public.content_level not null,
  read_minutes integer not null check (read_minutes > 0),
  key_points text[] not null default '{}',
  content_path text not null check (content_path ~ '^[a-z0-9][a-z0-9/-]*\.md$'),
  status public.publication_status not null default 'draft',
  sort_order integer not null default 0 check (sort_order >= 0),
  updated_at timestamptz not null default now(),
  foreign key (case_type_id, domain_id)
    references public.case_domain_mapping (case_type_id, domain_id) on delete restrict
);
create index guides_published_order_idx on public.guides (case_type_id, sort_order, id)
  where status = 'published';

-- Original diagram entities needed by comments.case_id. They are retained but
-- have no browser grants or application routes in the current MVP.
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  kind text
);
create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  guide_id uuid references public.guides (id) on delete restrict,
  title text not null,
  description text,
  case_type_id uuid not null references public.case_types (id) on delete restrict,
  domain_id uuid references public.domains (id) on delete restrict,
  company_id uuid references public.companies (id) on delete restrict,
  difficulty public.content_level not null,
  est_minutes integer not null check (est_minutes > 0),
  access text not null default 'free' check (access in ('free', 'pro')),
  status public.publication_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (case_type_id, domain_id)
    references public.case_domain_mapping (case_type_id, domain_id) on delete restrict
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.case_studies (id) on delete restrict,
  guide_id uuid references public.guides (id) on delete restrict,
  user_id uuid not null references public.profiles (id) on delete restrict,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  parent_id uuid references public.comments (id) on delete restrict,
  status public.comment_status not null default 'visible',
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  check (num_nonnulls(case_id, guide_id) = 1),
  check (parent_id is distinct from id)
);
create index comments_guide_order_idx on public.comments (guide_id, created_at, id)
  where status = 'visible' and deleted_at is null;

create function public.prepleet_create_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, name, username)
  values (new.id,
    coalesce(nullif(left(btrim(new.raw_user_meta_data ->> 'full_name'), 80), ''), 'Member'),
    'member_' || replace(new.id::text, '-', ''));
  return new;
end $$;
revoke all on function public.prepleet_create_profile() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.prepleet_create_profile();

-- Backfill identities that were created before the app migrations.
insert into public.profiles (id, name, username)
select id, coalesce(nullif(left(btrim(raw_user_meta_data ->> 'full_name'), 80), ''), 'Member'),
  'member_' || replace(id::text, '-', '') from auth.users
on conflict (id) do nothing;

create function public.prepleet_set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;
revoke all on function public.prepleet_set_updated_at() from public, anon, authenticated;
create trigger profiles_updated before update on public.profiles
  for each row execute function public.prepleet_set_updated_at();
create trigger guides_updated before update on public.guides
  for each row execute function public.prepleet_set_updated_at();

create function public.prepleet_check_comment_parent() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.parent_id is not null and not exists (
    select 1 from public.comments p where p.id = new.parent_id
      and p.guide_id is not distinct from new.guide_id
      and p.case_id is not distinct from new.case_id
  ) then
    raise exception 'Reply must target the same guide or case' using errcode = '23514';
  end if;
  return new;
end $$;
revoke all on function public.prepleet_check_comment_parent() from public, anon, authenticated;
create trigger comments_parent before insert or update on public.comments
  for each row execute function public.prepleet_check_comment_parent();

alter table public.profiles enable row level security;
alter table public.guides enable row level security;
alter table public.companies enable row level security;
alter table public.case_studies enable row level security;
alter table public.comments enable row level security;

revoke all on public.profiles, public.guides, public.companies,
  public.case_studies, public.comments from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant select on public.guides, public.comments to anon, authenticated;
grant insert (guide_id, user_id, body) on public.comments to authenticated;

create policy profiles_own_read on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy guides_published_read on public.guides for select to anon, authenticated
  using (status = 'published');
create policy comments_public_read on public.comments for select to anon, authenticated
  using (status = 'visible' and deleted_at is null and exists (
    select 1 from public.guides g where g.id = guide_id and g.status = 'published'
  ));
create policy comments_own_insert on public.comments for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'visible'
    and deleted_at is null and edited_at is null and parent_id is null
    and case_id is null and exists (
      select 1 from public.guides g where g.id = guide_id and g.status = 'published'
    ));

-- Deliberate owner-rights view: exposes ONLY the public author projection, not
-- owner-only profile details. Restricted to authors of publicly visible comments.
create view public.comment_authors with (security_barrier = true) as
select p.id, p.name, p.username, p.icon from public.profiles p
where exists (
  select 1 from public.comments c join public.guides g on g.id = c.guide_id
  where c.user_id = p.id and c.status = 'visible' and c.deleted_at is null
    and g.status = 'published'
);
revoke all on public.comment_authors from public, anon, authenticated;
grant select on public.comment_authors to anon, authenticated;
