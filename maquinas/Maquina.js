const Sequelize = require("sequelize");
const connection = require("../database/database");
const Evento = require("../eventos/Evento");

const Maquina = connection.define('maquinas', {
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    observacoes:{
        type: Sequelize.STRING,
        allowNull: true
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Maquina.belongsTo(Evento);
Evento.hasMany(Maquina);

//Maquina.sync ({force: true});

module.exports = Maquina;