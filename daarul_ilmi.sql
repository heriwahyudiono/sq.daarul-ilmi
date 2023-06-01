CREATE DATABASE daarul_ilmi;

USE daarul_ilmi;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_lengkap VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
  tanggal_lahir DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  nomor_telepon VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
);


CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  file_name VARCHAR(255),
  file_path VARCHAR(255),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE biodata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  perguruan_tinggi VARCHAR(255),
  fakultas VARCHAR(255),
  program_studi VARCHAR(255),
  angkatan INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE hasil_studi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  semester INT,
  ip FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


