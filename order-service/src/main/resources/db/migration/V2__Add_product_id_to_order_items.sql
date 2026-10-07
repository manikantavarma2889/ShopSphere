ALTER TABLE order_schema.order_items
    ADD COLUMN IF NOT EXISTS product_id BIGINT;

UPDATE order_schema.order_items
SET product_id = 0
WHERE product_id IS NULL;

ALTER TABLE order_schema.order_items
    ALTER COLUMN product_id SET NOT NULL;
