-- Create product_schema if not exists
CREATE SCHEMA IF NOT EXISTS product_schema;

-- Create categories table
CREATE TABLE IF NOT EXISTS product_schema.categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on category name
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name ON product_schema.categories(name);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON product_schema.categories(created_at);

-- Create products table
CREATE TABLE IF NOT EXISTS product_schema.products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description VARCHAR(2000),
    price DECIMAL(19,2) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    image_url VARCHAR(500),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    category_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES product_schema.categories(id)
);

-- Create unique index on product SKU
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON product_schema.products(sku);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_name ON product_schema.products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON product_schema.products(price);
CREATE INDEX IF NOT EXISTS idx_products_active ON product_schema.products(active);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON product_schema.products(category_id);