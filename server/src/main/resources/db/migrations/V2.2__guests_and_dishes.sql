CREATE TABLE guest
(
    id         SERIAL      NOT NULL PRIMARY KEY,
    entered_at TIMESTAMPTZ NOT NULL,
    leaved_at  TIMESTAMPTZ,
    table_id   INT         NOT NULL,
    waiter_id  INT8        NOT NULL
);

CREATE TABLE dish
(
    id          SERIAL  NOT NULL PRIMARY KEY,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL,
    price       NUMERIC NOT NULL
);

INSERT INTO dish (name, description, price)
VALUES ('Паста карбонара с коричневой шнягой', 'Паста карбонара с коричневой шнягой', 9999);
INSERT INTO dish (name, description, price)
VALUES ('Мяско с овощами', 'Мяско с овощами', 9999);
INSERT INTO dish (name, description, price)
VALUES ('Руссиано', 'Лучший напиток в истории человечества', 999);

CREATE TABLE guest_order_item
(
    id       SERIAL NOT NULL PRIMARY KEY,
    guest_id INT    NOT NULL,
    dish_id  INT    NOT NULL
);

