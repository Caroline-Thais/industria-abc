const Sequelize = require("sequelize");
const connection = require("../database/database");

const Evento = connection.define('eventos', {
    codigo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Evento.sync({force: true});

module.exports = Evento;