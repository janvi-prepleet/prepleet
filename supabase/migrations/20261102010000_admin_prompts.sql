-- Admin-only pipeline persistence. public.solutions is deliberately unchanged.
BEGIN;
CREATE SCHEMA IF NOT EXISTS prepleet_private;
REVOKE ALL ON SCHEMA prepleet_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS prepleet_private.admin_prompt_versions (
    version integer PRIMARY KEY CHECK (version > 0),
    content text NOT NULL CHECK (length(content) > 0),
    metadata jsonb NOT NULL,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS prepleet_private.admin_feedback_events (
    id uuid PRIMARY KEY,
    prompt_version integer NOT NULL REFERENCES prepleet_private.admin_prompt_versions(version),
    metadata jsonb NOT NULL,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE prepleet_private.admin_prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prepleet_private.admin_feedback_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON prepleet_private.admin_prompt_versions, prepleet_private.admin_feedback_events FROM PUBLIC, anon, authenticated;
COMMIT;
