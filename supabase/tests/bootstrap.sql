-- Disposable test cluster only. Supabase already provides these roles.
create role anon nologin;
create role authenticated nologin;

-- Reproduce older Supabase defaults to verify that the migration removes
-- inherited browser write privileges rather than relying on project defaults.
alter default privileges in schema public
  grant all on tables to anon, authenticated;
