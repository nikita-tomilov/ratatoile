CREATE TABLE kitchen_queue
(
    id                  SERIAL NOT NULL PRIMARY KEY,
    guest_order_item_id INT    NOT NULL REFERENCES guest_order_item (id)
)