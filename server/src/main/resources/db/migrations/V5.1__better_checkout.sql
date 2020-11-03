ALTER TABLE guest_card
    ADD COLUMN percentage INT DEFAULT 5;

CREATE TABLE paid_order_item
(
    id             SERIAL  NOT NULL PRIMARY KEY,
    order_item_id  INT     NOT NULL,
    original_price NUMERIC NOT NULL,
    paid_price     NUMERIC NOT NULL,
    guest_card_id  INT
);