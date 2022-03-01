const Sequelize = require('sequelize');

const connection = new Sequelize('industria', 'root', 'Passei1t', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});



module.exports = connection;