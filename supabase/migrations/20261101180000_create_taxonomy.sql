-- Preserve the table and column names in docs/DB_DESIGN.png.
create table public.domains (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (btrim(name) <> '')
);

create table public.case_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (btrim(name) <> ''),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0)
);

create table public.case_domain_mapping (
  case_type_id uuid not null references public.case_types (id) on delete restrict,
  domain_id uuid not null references public.domains (id) on delete restrict,
  primary key (case_type_id, domain_id)
);

create index case_domain_mapping_domain_id_idx
  on public.case_domain_mapping (domain_id, case_type_id);

alter table public.domains enable row level security;
alter table public.case_types enable row level security;
alter table public.case_domain_mapping enable row level security;

-- Supabase projects may have different default grants. Set the intended
-- browser privileges explicitly: public taxonomy is readable, never writable.
revoke all on public.domains, public.case_types, public.case_domain_mapping
  from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.domains, public.case_types, public.case_domain_mapping
  to anon, authenticated;

create policy domains_public_read on public.domains
  for select to anon, authenticated using (true);
create policy case_types_public_read on public.case_types
  for select to anon, authenticated using (true);
create policy case_domain_mapping_public_read on public.case_domain_mapping
  for select to anon, authenticated using (true);
