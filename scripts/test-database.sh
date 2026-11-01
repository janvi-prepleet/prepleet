#!/usr/bin/env bash
set -euo pipefail

# Owns a disposable container; never reads .env or DATABASE_URL.
repo_root="$(cd "$(dirname "$0")/.." && pwd)"
container_name="prepleet-db-test-$$-$RANDOM"
cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker run --detach --rm --network none --name "$container_name" \
  --tmpfs /var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=postgres postgres:17 >/dev/null
for attempt in {1..30}; do
  if docker exec "$container_name" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$container_name" pg_isready -U postgres

docker cp "$repo_root/supabase" "$container_name:/tmp/supabase"
docker exec "$container_name" psql -X -v ON_ERROR_STOP=1 -U postgres -d postgres \
  -f /tmp/supabase/tests/bootstrap.sql >/dev/null
for pass in 1 2; do
  docker exec "$container_name" createdb -U postgres prepleet_test
  docker exec "$container_name" psql -X -v ON_ERROR_STOP=1 -U postgres -d prepleet_test \
    -f /tmp/supabase/tests/run.sql
  docker exec "$container_name" dropdb -U postgres prepleet_test
  echo "PASS: clean database migration/test cycle $pass"
done
