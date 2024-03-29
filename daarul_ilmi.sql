CREATE DATABASE daarul_ilmi;

USE daarul_ilmi;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  gender ENUM('Male', 'Female') NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255),
  token_expiration TIMESTAMP,
  is_account_verified BOOLEAN DEFAULT 0, 
  is_login BOOLEAN,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  caption TEXT,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) 
);

CREATE TABLE photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  filename VARCHAR(255),
  file_path VARCHAR(255),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  filename VARCHAR(255),
  file_path VARCHAR(255),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
