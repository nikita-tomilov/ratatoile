ALTER TABLE guest_order_item
    ADD COLUMN status TEXT DEFAULT 'AWAITING_FOR_ACCEPTANCE';