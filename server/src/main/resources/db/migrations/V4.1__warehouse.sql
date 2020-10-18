ALTER TABLE ingredient
    ADD COLUMN warehouse_amount REAL DEFAULT 0.0;

ALTER TABLE ingredient
    ADD COLUMN uom TEXT DEFAULT 'кг';