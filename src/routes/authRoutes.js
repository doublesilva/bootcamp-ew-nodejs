const Joi = require('joi')
const Boom = require('boom')
const BaseRoute = require('./base/baseRoute');
const PasswordHelper = require('./../helpers/passwordHelper');

const Jwt = require('jsonwebtoken');
const failAction = (request, headers, erro) => {
    throw erro;
};

const USER = {
    username: 'Xuxadasilva',
    password: '123'
}
class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super();
        this._secret = secret;
        this._db = db;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Obter Token',
                notes: 'Faz login com usário e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }

            },
            handler: async (request) => {
                const { username, password } = request.payload;
                const [user] = await this._db.read({username: username.toLowerCase()});

                if(!user){
                    return Boom.unauthorized('Usuário informado não encontrado!');
                }

                const match = await PasswordHelper.comparePassword(password, user.password);
                if(!match) 
                    return Boom.unauthorized('O usuário ou senha inválidos!');
                const token = Jwt.sign({
                    username: username,
                    id: user.id,
                    
                }, this._secret)
                return { token };
            }
        }
    }
}

module.exports = AuthRoutes;