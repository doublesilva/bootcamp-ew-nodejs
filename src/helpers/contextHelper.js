const Postgres = require('./../bd/strategies/postgres/postgresSqlStrategy')
const MongoDb = require('./../bd/strategies/mongodb/mongodb.strategy');

const Context = require('./../bd/strategies/base/context.strategy')

class ContextHelper{

    constructor(){

    }

    static ContextMongoDb(schema){
        const connection = MongoDb.connect();
        return new Context(new MongoDb(connection, schema));
    }

    static async ContextPostgress(schema){
        const connection = await Postgres.connect();
        const model = await Postgres.defineModel(connection, schema);
        return new Context(new Postgres(connection, model))
    }

}

module.exports = ContextHelper;