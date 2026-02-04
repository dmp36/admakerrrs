CREATE DATABASE admakerrrs_db;
CREATE USER ad_admin WITH PASSWORD 'SecurePass_AdMkr_2026!';
GRANT ALL PRIVILEGES ON DATABASE admakerrrs_db TO ad_admin;
-- Allow the user to actually create tables in the public schema
\c admakerrrs_db
GRANT ALL ON SCHEMA public TO ad_admin;
