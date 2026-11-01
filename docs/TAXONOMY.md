# Taxonomy foundation

## Schema and reference data

Two ordered migrations under `supabase/migrations/` create the original diagram's domains, case_types and case_domain_mapping tables and populate the UI taxonomy. Domain records retain only id/name; case types retain id/name/slug/sort_order. The junction's composite primary key allows one type in multiple domains without duplicate pairs. Foreign keys restrict deletion of referenced catalog records.

The data migration supplies Consulting and Product Management, nine case types and ten memberships. Guesstimate is one row linked to both domains. Other types belong to their respective UI track. Production catalog data belongs in migrations so deployments cannot accidentally omit it. This does not enable non-MVP features or publish non-Guesstimate guides.

Browser roles anon and authenticated can SELECT the public taxonomy. Explicit revokes remove inherited write privileges, and SELECT-only RLS policies provide the second enforcement layer. No service-role key is required for ordinary reads. This PR adds no API routes or frontend components; those belong to the Next.js application chunks.

## Run local verification

With Docker running, from this checkout:

```sh
bash scripts/test-database.sh
```

The runner starts its own PostgreSQL 17 container with no external network or host ports, holds data in temporary memory storage and removes the container on exit. It does not load `.env`, accept DATABASE_URL or modify shared Supabase. Existing containers are not used. Allow up to 30 seconds for startup.

The test bootstrap creates Supabase-like browser roles and grants broad default table privileges, verifying that the migration explicitly removes them. The runner applies both migrations to an empty database, exercises the SQL assertions and repeats on a newly created empty database. Tests cover exact memberships/order, shared Guesstimate identity, duplicate names/slugs/pairs, invalid slugs/order, invalid foreign keys, restrictive deletes, real-role SELECT/INSERT/UPDATE/DELETE behavior, and RLS write denial even when table privileges are temporarily broadened. Test-only grants roll back.

GitHub's Database workflow runs the same command. It needs no project credentials. Its test server version is separate from the managed Supabase server; these migrations use PostgreSQL features available in Supabase-supported versions.

## Deployment boundary

These are reviewable migration files, not changes already applied to the hosted database. After merge, use the project's agreed migration/deployment workflow, retaining migration history. Do not paste ad hoc schema changes into the Supabase dashboard. App credentials, Supabase CLI project configuration and remote deployment verification are separate chunks.

## References

- [Supabase versioned migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase RLS and explicit grants](https://supabase.com/docs/guides/database/postgres/row-level-security)
