CREATE TABLE ingredient
(
    id   SERIAL NOT NULL PRIMARY KEY,
    name TEXT   NOT NULL
);

CREATE TABLE dish_ingredient
(
    id            SERIAL NOT NULL PRIMARY KEY,
    dish_id       INT    NOT NULL,
    ingredient_id INT    NOT NULL,
    amount        REAL
);

CREATE TABLE dish_photo
(
    id   SERIAL NOT NULL PRIMARY KEY,
    path TEXT   NOT NULL
);

ALTER TABLE dish
    ADD COLUMN photo_id INT DEFAULT NULL;
