-- noinspection SqlWithoutWhereForFile
DELETE FROM users_authorities;
DELETE FROM authority;
INSERT INTO authority(id, name) VALUES (1, 'MANAGER');
INSERT INTO authority(id, name) VALUES (2, 'WAITER');
INSERT INTO authority(id, name) VALUES (3, 'COOK');
INSERT INTO authority(id, name) VALUES (4, 'CHEF');

-- give user 'admin' all other authorities
INSERT INTO users_authorities(user_id, authority_id) VALUES (1, 1);
INSERT INTO users_authorities(user_id, authority_id) VALUES (1, 2);
INSERT INTO users_authorities(user_id, authority_id) VALUES (1, 3);
INSERT INTO users_authorities(user_id, authority_id) VALUES (1, 4);

-- give user1 & user2 waiter authorities
INSERT INTO users_authorities(user_id, authority_id) VALUES (2, 2);
INSERT INTO users_authorities(user_id, authority_id) VALUES (3, 2);

-- create new users

-- cook1
INSERT INTO USER_(ID, USER_NAME, PASSWORD, ACCOUNT_EXPIRED, ACCOUNT_LOCKED, CREDENTIALS_EXPIRED, ENABLED)
    VALUES (4, 'cook1', /*cook1*/'$2a$04$.g5CR6m69DBEbVwuaDYXB.cYoALBTCraKbmdEhBRLlLZEH8nb38Um', FALSE, FALSE, FALSE, TRUE);
INSERT INTO users_authorities(user_id, authority_id) VALUES (4, 3);

-- cook2
INSERT INTO USER_(ID, USER_NAME, PASSWORD, ACCOUNT_EXPIRED, ACCOUNT_LOCKED, CREDENTIALS_EXPIRED, ENABLED)
    VALUES (5, 'cook2', /*cook2*/'$2a$04$T/ytfofJQMsEV1SEze/qXeXiDT6WljPNXd36Y.Gtlq6AyQNnTUAaG', FALSE, FALSE, FALSE, TRUE);
INSERT INTO users_authorities(user_id, authority_id) VALUES (5, 3);

-- manager
INSERT INTO USER_(ID, USER_NAME, PASSWORD, ACCOUNT_EXPIRED, ACCOUNT_LOCKED, CREDENTIALS_EXPIRED, ENABLED)
    VALUES (6, 'manager', /*manager*/'$2a$04$7bB7QvgFnlETCcvzoBZQvu9Q7HDnEa59.yEYPSeyXYsVB6sfSgaJ2', FALSE, FALSE, FALSE, TRUE);
INSERT INTO users_authorities(user_id, authority_id) VALUES (6, 1);
INSERT INTO users_authorities(user_id, authority_id) VALUES (6, 2);

-- chef
INSERT INTO USER_(ID, USER_NAME, PASSWORD, ACCOUNT_EXPIRED, ACCOUNT_LOCKED, CREDENTIALS_EXPIRED, ENABLED)
    VALUES (7, 'chef', /*chef*/'$2a$04$hbxHdt13K1bcKuqXxUvWPeOa6BzRlljgHuWrKg58CgvcKVIiRGwgC', FALSE, FALSE, FALSE, TRUE);
INSERT INTO users_authorities(user_id, authority_id) VALUES (7, 4);
INSERT INTO users_authorities(user_id, authority_id) VALUES (7, 3);