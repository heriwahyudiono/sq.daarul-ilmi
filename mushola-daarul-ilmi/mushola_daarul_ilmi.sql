CREATE DATABASE mushola_daarul_ilmi;

USE mushola_daarul_ilmi;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

USE mushola_daarul_ilmi;
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    question VARCHAR(255) NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    option_e VARCHAR(255) NOT NULL,
    answer VARCHAR(255) NOT NULL
);

USE mushola_daarul_ilmi;
CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    exam_id INT NOT NULL,
    question_id INT NOT NULL,
    answer VARCHAR(255) NOT NULL
);

