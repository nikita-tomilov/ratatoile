CREATE TABLE reservation_request
(
    id            SERIAL      NOT NULL PRIMARY KEY,
    reserved_from TIMESTAMPTZ NOT NULL,
    reserved_to   TIMESTAMPTZ NOT NULL,
    comment       TEXT,
    person_name   TEXT        NOT NULL,
    person_phone  TEXT        NOT NULL,
    seats         INT         NOT NULL,
    table_type     TEXT        NOT NULL
)