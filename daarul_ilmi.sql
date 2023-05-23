CREATE DATABASE daarul_ilmi;

USE daarul_ilmi;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_lengkap VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
    tanggal_lahir DATE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    nomor_telepon VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255)
);

CREATE TABLE biodata (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    perguruan_tinggi VARCHAR(255),
    fakultas VARCHAR(255),
    program_studi VARCHAR(255),
    angkatan INT
);

CREATE TABLE hasil_studi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    semester INT,
    ip FLOAT
);