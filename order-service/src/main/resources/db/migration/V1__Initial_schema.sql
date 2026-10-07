-- Create order_schema if not exists
CREATE SCHEMA IF NOT EXISTS order_schema;

-- Create orders table
CREATE TABLE IF NOT EXISTS order_schema.orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(19,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    shipping_address VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on orders user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON order_schema.orders(user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON order_schema.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON order_schema.orders(created_at);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_schema.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(19,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(19,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order_items order_id
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_schema.order_items(order_id);

-- Create carts table
CREATE TABLE IF NOT EXISTS order_schema.carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on carts user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_carts_user_id ON order_schema.carts(user_id);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS order_schema.cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(19,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal DECIMAL(19,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on cart_items cart_id
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON order_schema.cart_items(cart_id);