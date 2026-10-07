-- Create payment_schema if not exists
CREATE SCHEMA IF NOT EXISTS payment_schema;

-- Create payments table
CREATE TABLE IF NOT EXISTS payment_schema.payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on payments order_id
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payment_schema.payments(order_id);

-- Create index on payments user_id
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payment_schema.payments(user_id);

-- Create index on payments status
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_schema.payments(status);

-- Create unique constraint on transaction_reference
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_transaction_ref ON payment_schema.payments(transaction_reference);