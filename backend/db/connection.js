const Sequelize = require('sequelize')
const DB_NAME = process.env.DBNAME || 'kollab'
const DB_USER = process.env.DBUSER || 'kollabadmin'
const DB_PASS = process.env.DBPASS || 'kollabpass'
const DB_HOST = process.env.DBHOST || 'localhost'

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'postgres'
})

db.authenticate()
    .then(() => console.log('Connection worked'))
    .catch((err) => console.error('Error = ', err))


module.exports = db