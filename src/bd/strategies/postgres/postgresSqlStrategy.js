const Sequelize = require('sequelize')
const IDb = require('../base/interface.bd')


class PostgresSqlStrategy extends IDb {
    constructor(connection, model) {
        super()
        this._connection = connection;
        this._db = model;
    }

    static async connect() {
        const sequelize = new Sequelize(
            'heroes',
            'doublesilva',
            'lapro203',
            {
                hotst: 'localhost',
                dialect: 'postgres',
                // case sensitive
                quoteIdentifiers: false,
                // deprecation warning
                operatorsAliases: false,
                //disable logging
                logging: false
            });
            return sequelize;
    }

    static async defineModel(connection, schema) {
        const model = connection.define(schema.name, schema.schema, schema.options);
        await model.sync();
        return model;
    }

    async isConnected() {
        try {
            await this._connection.authenticate();
            return true;
        } catch (error) {
            console.log('Fail: ', error)
            return false;
        }

    }

    insert(entity) {
        return this._db.create(entity, { raw: true});
    }

    read(entity = {}) {
        return this._db.findAll({
            where: entity,
            raw: true
        })
    }

    update(id, entity, upsert = false) {
        const fn = upsert ? 'upsert' : 'update';
        return this._db[fn](entity, { where:{ id } });
    }

    delete(id) {
        const query = id ? { id } : {}
        return this._db.destroy({where: query});
    }
}


module.exports = PostgresSqlStrategy;