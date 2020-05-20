CREATE TABLE critic_donations
(
    id          SERIAL      NOT NULL PRIMARY KEY,
    amount      INT         NOT NULL,
    critic_name TEXT        NOT NULL,
    reason      TEXT        NOT NULL,
    date        TIMESTAMPTZ NOT NULL
);

CREATE TABLE inspector_donations
(
    id          SERIAL      NOT NULL PRIMARY KEY,
    amount      INT         NOT NULL,
    reason      TEXT        NOT NULL,
    date        TIMESTAMPTZ NOT NULL
)