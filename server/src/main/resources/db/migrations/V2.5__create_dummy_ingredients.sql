INSERT INTO ingredient (id, name)
VALUES (1, 'паста');
INSERT INTO ingredient (id, name)
VALUES (2, 'сыр');
INSERT INTO ingredient (id, name)
VALUES (3, 'ветчина');
INSERT INTO ingredient (id, name)
VALUES (4, 'коричневая шняга');

INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (1, 1, 500.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (1, 2, 100.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (1, 3, 200.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (1, 4, 50.0);



INSERT INTO ingredient (id, name)
VALUES (5, 'фасоль');
INSERT INTO ingredient (id, name)
VALUES (6, 'томаты');
INSERT INTO ingredient (id, name)
VALUES (7, 'говядина');

INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (2, 5, 400.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (2, 6, 200.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (2, 7, 300.0);


INSERT INTO ingredient (id, name)
VALUES (8, 'кофе');
INSERT INTO ingredient (id, name)
VALUES (9, 'молоко');
INSERT INTO ingredient (id, name)
VALUES (10, 'русская душа');

INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (3, 8, 100.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (3, 9, 200.0);
INSERT INTO dish_ingredient(dish_id, ingredient_id, amount)
VALUES (3, 10, 10.0);