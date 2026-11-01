-- Production reference data from TRACK_NAME, TYPES and TRACK_TYPES in
-- docs/UI_DESIGN.jsx. This belongs in migrations so every environment gets it.
insert into public.domains (id, name) values
  ('00000000-0000-4000-8000-000000000001', 'Consulting'),
  ('00000000-0000-4000-8000-000000000002', 'Product Management');

insert into public.case_types (id, name, slug, sort_order) values
  ('00000000-0000-4000-8000-000000000101', 'Guesstimate', 'guesstimate', 1),
  ('00000000-0000-4000-8000-000000000102', 'Profitability', 'profitability', 2),
  ('00000000-0000-4000-8000-000000000103', 'Pricing Strategy', 'pricing-strategy', 3),
  ('00000000-0000-4000-8000-000000000104', 'Market Entry', 'market-entry', 4),
  ('00000000-0000-4000-8000-000000000105', 'M&A', 'mergers-and-acquisitions', 5),
  ('00000000-0000-4000-8000-000000000106', 'Go-to-Market', 'go-to-market', 6),
  ('00000000-0000-4000-8000-000000000107', 'Product Design', 'product-design', 7),
  ('00000000-0000-4000-8000-000000000108', 'Metric Cases', 'metric-cases', 8),
  ('00000000-0000-4000-8000-000000000109', 'RCA Cases', 'rca-cases', 9);

insert into public.case_domain_mapping (case_type_id, domain_id)
select t.id, d.id
from (values
  ('Guesstimate', 'Consulting'),
  ('Profitability', 'Consulting'),
  ('Pricing Strategy', 'Consulting'),
  ('Market Entry', 'Consulting'),
  ('M&A', 'Consulting'),
  ('Go-to-Market', 'Consulting'),
  ('Guesstimate', 'Product Management'),
  ('Product Design', 'Product Management'),
  ('Metric Cases', 'Product Management'),
  ('RCA Cases', 'Product Management')
) as membership (case_type, domain)
join public.case_types t on t.name = membership.case_type
join public.domains d on d.name = membership.domain;
