-- Create auth_schema if not exists
CREATE SCHEMA IF NOT EXISTS auth_schema;

-- Create users table
CREATE TABLE IF NOT EXISTS auth_schema.users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON auth_schema.users(email);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_created_at ON auth_schema.users(created_at);