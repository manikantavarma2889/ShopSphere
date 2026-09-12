# ShopSphere Database Design

## Overview

ShopSphere uses PostgreSQL as the primary database with separate schemas for each microservice. This design ensures data ownership and prevents cross-service database coupling.

## Schema Structure

Each service owns its own schema, containing only its relevant tables:

### auth_schema

Contains authentication and user management data.

| Table | Description |
|-------|-------------|
| `users` | User accounts with authentication data |
| `addresses` | User shipping addresses |

### product_schema

Contains product catalog and inventory data.

| Table | Description |
|-------|-------------|
| `categories` | Product categories |
| `products` | Product catalog with details |
| `inventory` | Stock levels (though stock_quantity is on products table) |

### order_schema

Contains order management data.

| Table | Description |
|-------|-------------|
| `orders` | Order headers |
| `order_items` | Individual items within orders |
| `carts` | Shopping carts |
| `cart_items` | Items in shopping carts |

### payment_schema

Contains payment processing data.

| Table | Description |
|-------|-------------|
| `payments` | Payment records and status |

## Entity Relationships

### Users Table (auth_schema)
- **id**: Primary key, BIGSERIAL
- **first_name**: NOT NULL, VARCHAR(50)
- **last_name**: NOT NULL, VARCHAR(50)
- **email**: UNIQUE, NOT NULL, VARCHAR(100)
- **password_hash**: NOT NULL, VARCHAR(255)
- **role**: VARCHAR(20), NOT NULL (CUSTOMER/ADMIN)
- **enabled**: BOOLEAN, NOT NULL, DEFAULT TRUE
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Categories Table (product_schema)
- **id**: Primary key, BIGSERIAL
- **name**: UNIQUE, NOT NULL, VARCHAR(100)
- **description**: VARCHAR(500)
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Products Table (product_schema)
- **id**: Primary key, BIGSERIAL
- **name**: NOT NULL, VARCHAR(200)
- **description**: VARCHAR(2000)
- **price**: DECIMAL(19,2), NOT NULL
- **sku**: UNIQUE, NOT NULL, VARCHAR(50)
- **image_url**: VARCHAR(500)
- **stock_quantity**: INTEGER, NOT NULL, DEFAULT 0
- **active**: BOOLEAN, NOT NULL, DEFAULT TRUE
- **category_id**: BIGINT, FK → categories(id)
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Orders Table (order_schema)
- **id**: Primary key, BIGSERIAL
- **user_id**: BIGINT, NOT NULL
- **total_amount**: DECIMAL(19,2), NOT NULL
- **status**: VARCHAR(20), NOT NULL, DEFAULT 'PENDING'
- **payment_status**: VARCHAR(20), NOT NULL, DEFAULT 'PENDING'
- **shipping_address**: VARCHAR(500)
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### OrderItems Table (order_schema)
- **id**: Primary key, BIGSERIAL
- **order_id**: BIGINT, NOT NULL
- **product_name**: VARCHAR(200), NOT NULL (snapshot)
- **unit_price**: DECIMAL(19,2), NOT NULL (snapshot)
- **quantity**: INTEGER, NOT NULL, DEFAULT 1
- **subtotal**: DECIMAL(19,2), NOT NULL
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Carts Table (order_schema)
- **id**: Primary key, BIGSERIAL
- **user_id**: BIGINT, NOT NULL
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### CartItems Table (order_schema)
- **id**: Primary key, BIGSERIAL
- **cart_id**: BIGINT, NOT NULL
- **product_id**: BIGINT, NOT NULL
- **product_name**: VARCHAR(200), NOT NULL
- **unit_price**: DECIMAL(19,2), NOT NULL
- **quantity**: INTEGER, NOT NULL, DEFAULT 1
- **subtotal**: DECIMAL(19,2), NOT NULL
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

### Payments Table (payment_schema)
- **id**: Primary key, BIGSERIAL
- **order_id**: BIGINT, NOT NULL
- **user_id**: BIGINT, NOT NULL
- **amount**: DECIMAL(19,2), NOT NULL
- **status**: VARCHAR(20), NOT NULL, DEFAULT 'PENDING'
- **transaction_reference**: VARCHAR(100)
- **created_at**: TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, DEFAULT CURRENT_TIMESTAMP

## Indexes and Constraints

### Unique Constraints
- `users.email` - Unique email addresses
- `products.sku` - Unique SKU codes
- `categories.name` - Unique category names
- `payments.transaction_reference` - Unique transaction references

### Indexes
- `idx_users_email` - Index on users.email
- `idx_products_name` - Index on products.name
- `idx_products_price` - Index on products.price
- `idx_products_active` - Index on products(active)
- `idx_orders_user_id` - Index on orders.user_id
- `idx_orders_status` - Index on orders.status
- `idx_order_items_order_id` - Index on order_items.order_id
- `idx_carts_user_id` - Unique index on carts.user_id
- `idx_cart_items_cart_id` - Index on cart_items.cart_id
- `idx_payments_order_id` - Index on payments.order_id
- `idx_payments_user_id` - Index on payments.user_id
- `idx_payments_status` - Index on payments.status

## Flyway Migrations

Each service has its own Flyway migration directory:

### service-discovery
- `v1__Initial_schema.sql` - Eureka server configuration

### auth-service
- `v1__Initial_schema.sql` - Users table creation

### product-service
- `v1__Initial_schema.sql` - Categories and products tables

### order-service
- `v1__Initial_schema.sql` - Orders, order_items, carts, cart_items tables

### payment-service
- `v1__Initial_schema.sql` - Payments table

### Migration Commands
```bash
# Run migrations
mvn flyway:migrate

# Info about migrations
mvn flyway:info

# Baseline (initial migration)
mvn flyway:baseline

# Migrate to specific version
mvn flyway:migrate -Dflyway.targetVersion=1.0
```

## Supabase Production Database

### Setup Instructions
1. Create a Supabase project at https://supabase.io
2. Obtain connection details:
   - Project URL: `https://<project-ref>.supabase.co`
   - Anonymous key: From project settings
   - Service role key: From project settings (for backend use only)

### Configuration
Update environment variables for production:
```
DATABASE_URL=postgresql://shopsphere:secret@db.<project-ref>.supabase.co:5432/shopsphere
DATABASE_USERNAME=shopsphere
DATABASE_PASSWORD=secret
```

### Schema Creation
Run Flyway migrations with the appropriate schema:
```bash
# Set spring.flyway.schemas in application-prod.yml
spring:
  flyway:
    schemas: auth_schema  # or product_schema, order_schema, payment_schema
```

### Important Notes
- **Never expose Supabase secrets in frontend code**
- Use the anon key only for client-side Supabase SDK usage
- Service role key should only be used server-side
- Enable Row Level Security (RLS) for production security
- Monitor query performance and add indexes as needed

## Migration Best Practices

### Before Deploying
1. Test migrations on a copy of production data
2. Ensure Flyway baseline is set
3. Verify schema names match the target environment
4. Backup critical data before migration

### After Migration
1. Verify all tables are created correctly
2. Check that data integrity is maintained
3. Test application startup with new schema
4. Monitor application logs for errors

### Versioning
- Each migration is versioned (V1, V2, etc.)
- Migrations are cumulative - each adds to the previous
- Never modify existing migration files
- Add new migrations for schema changes