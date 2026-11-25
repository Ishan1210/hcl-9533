-- DDL Task 1 
CREATE DATABASE school_db;
USE school_db;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL CHECK (name <> ''),
    email VARCHAR(100) UNIQUE,
    age INT CHECK (age >= 5),
    city VARCHAR(50) DEFAULT 'Delhi',
    admission_date DATE
);

-- DDL Task 2 
CREATE TABLE marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(30),
    score INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

ALTER TABLE students ADD phone VARCHAR(10);
ALTER TABLE students MODIFY phone VARCHAR(15);
ALTER TABLE students RENAME COLUMN city TO hometown;
CREATE INDEX idx_name ON students(name);
CREATE TABLE students_backup LIKE students;
DROP TABLE students_backup;

-- DML Task 1 
INSERT INTO students (name, email, age, admission_date)
VALUES ('Aarav', 'aarav@example.com', 12, '2025-04-01');

INSERT INTO students (name, email, age, hometown, admission_date) VALUES
('Ananya', 'ananya@example.com', 14, 'Delhi', '2025-04-01'),
('Rohan', 'rohan@example.com', 16, 'Mumbai', '2025-04-02'),
('Priya', 'priya@example.com', 11, 'Delhi', '2025-04-03'),
('Kabir', 'kabir@example.com', 9, 'Noida', '2025-04-04'),
('Meera', 'meera@example.com', 13, 'Jaipur', '2025-04-05');

INSERT INTO marks (student_id, subject, score) VALUES
(1, 'Maths', 80),
(1, 'Science', 75),
(1, 'English', 65),
(2, 'Maths', 90),
(2, 'Science', 85),
(2, 'English', 70),
(3, 'Maths', 55),
(3, 'Science', 15),
(4, 'Maths', 60),
(4, 'English', 50),
(6, 'Maths', 65);


-- DML Task 2 
SET SQL_SAFE_UPDATES = 0;
UPDATE marks SET score = score + 5 WHERE subject = 'Maths';
UPDATE students SET hometown = 'Noida' WHERE student_id = 2;
UPDATE students SET age = age + 1 WHERE hometown = 'Delhi';

DELETE FROM marks WHERE student_id = 6;
DELETE FROM students WHERE student_id = 6;
DELETE FROM marks WHERE score < 20;
SET SQL_SAFE_UPDATES = 1;

-- DQL Task 1
SELECT * FROM students;
SELECT name AS 'Student Name', hometown FROM students;
SELECT * FROM students WHERE age BETWEEN 10 AND 15;
SELECT * FROM students WHERE name LIKE 'A%';
SELECT * FROM students WHERE hometown IN ('Delhi', 'Noida') ORDER BY age DESC;
SELECT * FROM students ORDER BY age DESC LIMIT 3;
SELECT DISTINCT hometown FROM students;

-- DQL Task 2 
SELECT hometown, COUNT(*) FROM students GROUP BY hometown;
SELECT subject, AVG(score), MAX(score), MIN(score) FROM marks GROUP BY subject;
SELECT subject, AVG(score) FROM marks GROUP BY subject HAVING AVG(score) > 60;

SELECT students.name, marks.subject, marks.score
FROM students INNER JOIN marks ON students.student_id = marks.student_id;

SELECT students.name, marks.subject, marks.score
FROM students LEFT JOIN marks ON students.student_id = marks.student_id;

SELECT * FROM students WHERE student_id IN (
    SELECT student_id FROM marks WHERE score > (SELECT AVG(score) FROM marks)
);

SELECT students.name, SUM(marks.score) AS total_marks,
       RANK() OVER (ORDER BY SUM(marks.score) DESC) AS student_rank
FROM students INNER JOIN marks ON students.student_id = marks.student_id
GROUP BY students.student_id, students.name;

-- TCL Task 1 
SET autocommit = 0;
START TRANSACTION;
UPDATE marks SET score = 100 WHERE mark_id = 1;
SELECT * FROM marks WHERE mark_id = 1;
ROLLBACK;
SELECT * FROM marks WHERE mark_id = 1;

START TRANSACTION;
UPDATE marks SET score = 100 WHERE mark_id = 1;
SELECT * FROM marks WHERE mark_id = 1;
COMMIT;
SELECT * FROM marks WHERE mark_id = 1;

-- TCL Task 2 
START TRANSACTION;
INSERT INTO students (name, email, age) VALUES ('Diya', 'diya@example.com', 12);
SAVEPOINT s1;
INSERT INTO students (name, email, age) VALUES ('Arjun', 'arjun@example.com', 15);
SAVEPOINT s2;
DELETE FROM marks WHERE mark_id = 2;
ROLLBACK TO s2;
SELECT * FROM students;
SELECT * FROM marks;
ROLLBACK TO s1;
SELECT * FROM students;
SELECT * FROM marks;
COMMIT;
SET autocommit = 1;


-- DCL Task 1 
CREATE USER 'teacher1'@'localhost' IDENTIFIED BY 'Teacher@123';
GRANT SELECT, INSERT, UPDATE ON school_db.marks TO 'teacher1'@'localhost';
SHOW GRANTS FOR 'teacher1'@'localhost';

-- DCL Task 2 
REVOKE UPDATE ON school_db.marks FROM 'teacher1'@'localhost';
CREATE ROLE 'viewer';
GRANT SELECT ON school_db.* TO 'viewer';
CREATE USER 'guest1'@'localhost' IDENTIFIED BY 'Guest@123';
GRANT 'viewer' TO 'guest1'@'localhost';
SET DEFAULT ROLE 'viewer' TO 'guest1'@'localhost';
SHOW GRANTS FOR 'guest1'@'localhost';
DROP USER 'teacher1'@'localhost';
DROP USER 'guest1'@'localhost';

-- Data Types and Constraints Task 1 
CREATE TABLE library_books (
    title VARCHAR(100),
    isbn CHAR(13),
    price DECIMAL(10,2),
    copies INT,
    available BOOLEAN,
    category ENUM('Fiction', 'Science', 'History'),
    published_year YEAR,
    description TEXT
);

-- Data Types and Constraints Task 2 
CREATE TABLE teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    name VARCHAR(50) NOT NULL,
    salary DECIMAL(10,2) CHECK (salary > 0),
    joining_date DATE DEFAULT (CURRENT_DATE)
);

INSERT INTO teachers (email, name, salary) VALUES ('neha@example.com', 'Neha', 35000);
-- INSERT INTO teachers (email, name, salary) VALUES ('neha@example.com', 'Ravi', 30000); -- Error 1062: Duplicate entry
-- INSERT INTO teachers (email, name, salary) VALUES ('ravi@example.com', NULL, 30000); -- Error 1048: Name cannot be null
-- INSERT INTO teachers (email, name, salary) VALUES ('amit@example.com', 'Amit', -5000); -- Error 3819: Check constraint violated
