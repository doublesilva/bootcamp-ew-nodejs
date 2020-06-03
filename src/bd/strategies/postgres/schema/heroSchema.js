const Sequelize = require('sequelize');
const HeroSchema =  {
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true 
        },
        nome: {
            type: Sequelize.STRING,
            required: true
        },
        poder: {
            type: Sequelize.STRING,
            required: true
        },
        insertedAt: {
            type: Sequelize.DATE,
            required: true,
            defaultValue: Sequelize.NOW
        }
    },
    options: {
        tableName: 'Hero',
        freezeTableName: false,
        timestamps: false
    }
}


module.exports = HeroSchema