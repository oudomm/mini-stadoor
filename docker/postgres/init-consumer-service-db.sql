SELECT 'CREATE DATABASE consumer_service_db'
WHERE NOT EXISTS (
    SELECT
    FROM pg_database
    WHERE datname = 'consumer_service_db'
)\gexec
