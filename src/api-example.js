const Hapi = require('hapi');
const Context = require('./bd/strategies/base/context.strategy')
const MongoDb  = require('./bd/strategies/mongodb/mongodb.strategy');
const HeroSchema = require('./bd/strategies/mongodb/schema/hero.schema')
const app = new Hapi.Server({ port: 5000});

async function Main(){
        const connection = MongoDb.connect();
        const context =  new Context(new MongoDb(connection, HeroSchema));
        app.route([{
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                console.log('chegou aqui');
                return context.read();
            }
        }]);
   await app.start();
   console.log(`Servidor rodando na porta `+ app.info.port);
}


Main();