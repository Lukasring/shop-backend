const mysql = require("mysql2");
const nodemon = require("nodemon");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "mandarinas123",
});

module.exports = pool.promise();
