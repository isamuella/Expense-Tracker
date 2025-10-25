const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const dbCb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

dbCb.connect((err) => {
    if (err) throw err;
    console.log("Connected to db...");
});

const db = dbCb.promise();

module.exports = db;