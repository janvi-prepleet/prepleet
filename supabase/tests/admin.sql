DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['admin_prompt_versions','admin_feedback_events'] LOOP
    IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid = ('prepleet_private.' || table_name)::regclass) THEN
      RAISE EXCEPTION 'Admin table % lacks RLS', table_name;
    END IF;
    IF has_table_privilege('anon', 'prepleet_private.' || table_name, 'SELECT')
       OR has_table_privilege('authenticated', 'prepleet_private.' || table_name, 'SELECT') THEN
      RAISE EXCEPTION 'Admin table % exposes private records', table_name;
    END IF;
  END LOOP;
END $$;
