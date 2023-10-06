const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "daarul-ilmi",
  password: "",
  database: "db-daarul-ilmi",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

module.exports = connection;
