const Hapi = require('hapi');
const Context = require('./bd/strategies/base/context.strategy')
const MongoDb = require('./bd/strategies/mongodb/mongodb.strategy');
const HeroSchema = require('./bd/strategies/mongodb/schema/hero.schema')
const HeroRoute = require('./routes/heroRoutes');
const HapiSwagger = require('hapi-swagger');
const Vision = require('vision')
const Inert = require('inert');
const app = new Hapi.Server({ port: 5000 });

function mapRoutes(instance, methods) {
    return methods.map(method =>  instance[method]());
}

async function Main() {
    const connection = MongoDb.connect();
    const context = new Context(new MongoDb(connection, HeroSchema));  
    const swaggerOtions = {
        info:{
            title: 'API Heroes - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([Vision, Inert, { 
        plugin: HapiSwagger,
        options: swaggerOtions
    }])

    app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));
    await app.start();  
    return app;
}


module.exports = Main();