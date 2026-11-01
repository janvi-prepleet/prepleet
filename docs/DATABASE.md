# Database design contract

Status: user answers recorded in `quries.doc`; MVP design decisions resolved on 2026-11-01. The source of truth is `DB_DESIGN.png`, together with the saved `UI_DESIGN.jsx`. The earlier simplified schema proposal is withdrawn following the user's instruction on 2026-11-01. No schema migrations have been applied.

## Preserve the supplied design

Keep the diagram's names and relationships. Do not replace `profiles.name` with `display_name`, replace `guides.content_path` with a Markdown body column, remove taxonomies or discard other diagram tables. User-approved clarifications and delegated technical choices are recorded in `quries.doc`. Any new product/schema gap must be recorded there and raised before dependent work. Tables can be delivered in separate PRs without implementing their associated future features.

The diagram contains:

- Supabase-managed `auth.users` and one-to-one `profiles`, including name, username, education/work fields, birth year, timestamps and icon.
- `domains`, `case_types`, and the proposed `case_domain_mapping` junction.
- `guides` with case type, domain, guide type, title, level, read minutes, key points, Markdown content path, publication status, sorting and update time.
- `guide_progress` keyed by user and guide, with opened/completed timestamps.
- `case_studies` with optional guide link, type/domain/company associations, difficulty, estimated minutes, access, publication status and timestamps.
- `case_companies` and `companies` for company associations and year.
- `user_case_state` keyed by user and case, including attempt_click and bookmarked.
- `solutions` linked to cases, with question, agentic solution JSON, whiteboard JSON, model, version, and publication status.
- `comments` with case/guide/user/parent references, body, status and timestamps.
- `comment_reactions` keyed by comment and user with reaction and creation time.

## Taxonomy established by the UI

`TRACK_NAME`, `TOPICS`, `TOPIC_TYPE` and `TRACK_TYPES` at UI lines 107–115 establish the terminology. UI tracks map to database domains; topics/types map to case types. Industry labels such as Mobility and Food tech are not domains.

| Domain | UI key | Case types |
| --- | --- | --- |
| Consulting | `consulting` | Guesstimate, Profitability, Pricing Strategy, Market Entry, M&A, Go-to-Market |
| Product Management | `product` | Guesstimate, Product Design, Metric Cases, RCA Cases |

The same Guesstimate type appears in both domains. It is one shared content identity. Keep `guides.domain_id` nullable: null inherits domain membership from `case_domain_mapping`; a non-null value must be a valid domain/type pair and narrows visibility. Comments attach to the shared guide ID, independently of the navigation domain. UI labels such as Guesstimates, Profitability Cases and Merger & Acq. differ from canonical type names; preserve the displayed labels when rendering.

`KINDS` at UI lines 127–132 defines four guide categories: In a hurry (`hurry`), Core Concepts (`concepts`), Solved Cases (`solved`), and Patterns & Trends (`patterns`). The diagram lists three, but the user explicitly approved the fourth category in Q2. Keep these backend values and map them to the exact UI labels.

## Resolved implementation contract

- `quries.doc` contains the user's answers and the technical defaults delegated to the agent. Backend scope remains authentication, published Guesstimate guides, PDF download and posting comments. Practice is Coming soon. No dashboard, community or subscriptions.
- Preserve the supplied public/authenticated navigation, domain/type/category hubs and reader layouts for the applicable screens. Keep non-MVP actions explicit as Coming soon; do not display prototype statistics as real data. Profiles use diagram columns only, without adding the UI's extra work-history/goals fields.
- Store guide Markdown in `frontend/content/guides`; `guides.content_path` remains the path reference. Resolve only allowlisted Markdown under that directory on the server. Placeholder content is sufficient for development.
- Provide a static sample PDF under `frontend/public/pdfs`, mapped from source for now. PDF content/production is a separate later pipeline. Do not create a PDF schema or Storage integration for this temporary support.
- Add comments below the guide reader using the reference UI styles. Enforce exactly one of `guide_id` and `case_id`; keep the other null. Retain parent_id and edit/delete columns from the diagram, but no replies/edit/delete UI is required now. A reply relationship, when introduced, must stay on the same target.
- Case type foreign keys have one-to-many cardinality. Retain company-related fields from the diagram; resolve any future feature-specific ambiguity in that feature's PR instead of guessing a live behavior now.
- Technical defaults delegated by the user: UUID primary keys; unique non-empty content slugs; Easy/Medium/Hard levels; draft/published/archived content; visible/hidden comments; database constraints plus server validation; RLS; public author name/username/icon only. Preserve private profile columns behind owner-only access. Use explicit public author projections rather than public SELECT on all profile fields.
- Signup collects a name and generates a unique username without exposing email in the public handle. Other diagram profile details are optional. Authentication uses email/password with confirmation and recovery, as previously agreed; Google login is deferred.
- Archive published content and restrict deletion while referenced; use the diagram's comment soft-delete fields. No account-deletion product flow is included. Reaction, company, practice and other future-feature rules are implemented only when their own scope is authorized.
- Public reading/downloads and owner moderation remain as agreed. No admin application is needed. Repository content changes and metadata publishing steps must be documented with their implementation.

## Delivery and validation

Implement small feature branches and PRs; the user merges into main. Each schema PR must include a migration, focused tests and documentation of the corresponding answered questions. Test publication access, identity isolation, valid foreign keys, shared-domain filtering and preservation of design fields. Never use a privileged database connection for ordinary browser requests. Connectivity is separate from schema approval: Postgres read-only SELECT 1 succeeded, Auth was reachable, and REST authorization remains unresolved.

## Taxonomy migration implementation

The first schema PR adds `domains`, `case_types` and `case_domain_mapping`, with the diagram's column names and restrictive foreign-key deletes. Catalog data is a production reference-data migration, rather than optional development seed data: all environments need the same nine case types and ten domain/type memberships. Stable UUIDs identify these catalog records; UI-specific keys and display-label differences stay in the frontend mapping when that chunk is implemented.

RLS and explicit SELECT grants let anonymous/authenticated visitors read the taxonomy. Those roles have no INSERT/UPDATE/DELETE grants or write policies. Administrative migrations manage reference data. See `TAXONOMY.md` for local tests and review/deployment boundaries. These files have not been applied to shared Supabase.
