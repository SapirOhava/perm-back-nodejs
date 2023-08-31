CREATE DATABASE perntodo;

--  the primary key indicates that this column is what going to make this 
--  entire to do unique from the other todo's , the serial is a function thats going to
--  increase our primary key to ensure uniqueness.
-- varchar(255) means max characters of 255 
-- the user postgres in our postgres db - is actually a super admin that has full access to everything.
-- the commands he makes in postgres ,  \l - list all db's , \c <db name> to connect to this db .
--  \dt - to look all the db tables 
--  now were going to connect our postgres database and server
--  by creating a file called db.js - this file is going to configure how were going to connect to our database.


CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,  
    description VARCHAR(255)
);