#!/bin/sh
# Create Temporal databases (run once when Postgres data dir is first created).
# Postgres runs scripts in /docker-entrypoint-initdb.d only on initial DB creation.
# ON_ERROR_STOP=0 so we don't fail if DBs already exist.
psql -v ON_ERROR_STOP=0 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE temporal;
  CREATE DATABASE temporal_visibility;
EOSQL
