CREATE DATABASE daarul_ilmi;

USE daarul_ilmi;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  gender ENUM('Male', 'Female') NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255)
);

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  filename VARCHAR(255),
  file_path VARCHAR(255),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE group_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  message TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
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
  semester INT,
  ip FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
