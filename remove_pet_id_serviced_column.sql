-- Script to drop the pet_id_serviced column from order_items table

-- Step 1: Drop foreign key constraint if it exists
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS FK_order_items_pet_serviced;

-- Step 2: Drop the column
ALTER TABLE order_items DROP COLUMN IF EXISTS pet_id_serviced;

-- Note: This change is part of removing the redundant petIdServiced field
-- The pet_id column already indicates which pet is receiving the service
