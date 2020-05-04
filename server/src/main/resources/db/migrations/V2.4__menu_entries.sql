CREATE TABLE menu_entry
(
    id            SERIAL NOT NULL PRIMARY KEY,
    dish_id       INT    NOT NULL,
    added_at      BIGINT NOT NULL,
    menu_position INT    NOT NULL
);

INSERT INTO menu_entry (dish_id, added_at, menu_position)
VALUES (1, 0, 1);
INSERT INTO menu_entry (dish_id, added_at, menu_position)
VALUES (2, 0, 2);
INSERT INTO menu_entry (dish_id, added_at, menu_position)
VALUES (3, 0, 3);