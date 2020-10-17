CREATE TABLE guest_card
(
    id        SERIAL      NOT NULL PRIMARY KEY,
    full_name TEXT        NOT NULL,
    phone     TEXT        NOT NULL,
    birthday  TIMESTAMPTZ NOT NULL
);