const Sequelize = require("sequelize");
const DB_NAME = process.env.DBNAME || "kollab";
const DB_USER = process.env.DBUSER || "kollabadmin";
const DB_PASS = process.env.DBPASS || "kollabpass";
const DB_HOST = process.env.DBHOST || "localhost";
const DB_URL =
  process.env.DATABASE_URL ||
  `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}`;

const db = new Sequelize(DB_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

db.authenticate()
  .then(() => console.log("Connection worked"))
  .catch((err) => console.error("Error = ", err));

module.exports = db;
