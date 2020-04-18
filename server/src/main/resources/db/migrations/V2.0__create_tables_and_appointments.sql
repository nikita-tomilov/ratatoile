CREATE TABLE eating_table
(
    id        SERIAL NOT NULL PRIMARY KEY,
    gui_x     REAL   NOT NULL,
    gui_y     REAL   NOT NULL,
    gui_w     REAL   NOT NULL,
    gui_h     REAL   NOT NULL,
    max_seats INT    NOT NULL,
    type      TEXT   NOT NULL
);

CREATE TABLE reservation
(
    id            SERIAL      NOT NULL PRIMARY KEY,
    table_id      INT         NOT NULL,
    reserved_from TIMESTAMPTZ NOT NULL,
    reserved_to   TIMESTAMPTZ NOT NULL,
    comment       TEXT
)