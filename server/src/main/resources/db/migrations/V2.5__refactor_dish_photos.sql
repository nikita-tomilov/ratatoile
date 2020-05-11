DROP TABLE dish_photo;

ALTER TABLE dish
    DROP COLUMN photo_id;

CREATE TABLE dish_photo
(
    dish_id BIGINT NOT NULL PRIMARY KEY,
    image   bytea  NOT NULL
);