const { config } = require('dotenv');
const { join } = require('path');
const { ok } = require('assert')
const env = process.env.NODE_ENV || 'dev'
ok(env === "prod" || env === "dev", 'a env é inválida, ou dev ou prod');

const configPath = join(__dirname, './config', `.env.${env}`);

config({
    path: configPath
});


const Hapi = require('hapi');

const HeroRoute = require('./src/routes/heroRoutes');
const AuthRoute = require('./src/routes/authRoutes');

const UserSchemaPostgres = require('./src/bd/strategies/postgres/schema/userSchema');
const HeroSchemaMongo = require('./src/bd/strategies/mongodb/schema/hero.schema');
const HelperContext = require('./src/helpers/contextHelper');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision')
const Inert = require('inert');
const app = new Hapi.Server({ port: process.env.PORT });
const HaipJwt = require('hapi-auth-jwt2');
const JWT_SECRET = process.env.JWT_KEY;

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

async function Main() {

    const swaggerOtions = {
        info: {
            title: 'API Heroes - #CursoNodeBR',
            version: 'v1.0'
        },
        lang: 'pt'
    }
    await app.register([HaipJwt, Vision, Inert, {
        plugin: HapiSwagger,
        options: swaggerOtions
    }])
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (data, request) => {
            const context = await HelperContext.ContextPostgress(UserSchemaPostgres);

            const [result] = await context.read({ username: data.username.toLowerCase(), id: data.id });
            
            if (!result) {
                return { isValid: false };
            }

            return { isValid: true };
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroRoute(HelperContext.ContextMongoDb(HeroSchemaMongo)), HeroRoute.methods()),
        ...mapRoutes(new AuthRoute(JWT_SECRET, (await HelperContext.ContextPostgress(UserSchemaPostgres))), AuthRoute.methods())
    ]);
    await app.start();
    return app;
}


module.exports = Main();