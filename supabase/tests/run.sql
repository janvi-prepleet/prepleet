\set ON_ERROR_STOP on
\ir auth-fixture.sql
\ir ../migrations/20261101180000_create_taxonomy.sql
\ir ../migrations/20261101180100_seed_taxonomy.sql
\ir ../migrations/20261101190000_mvp_content.sql
\ir ../migrations/20261101190100_sample_guides.sql
\ir ../migrations/20261102010000_admin_prompts.sql
\ir admin.sql
\ir taxonomy.sql
\ir mvp.sql
