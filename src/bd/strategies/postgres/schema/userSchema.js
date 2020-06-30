const Sequelize = require('sequelize');
const UserSchema =  {
    name: 'users',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true 
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        password: {
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
        tableName: 'User',
        freezeTableName: false,
        timestamps: false
    }
}


module.exports = UserSchema