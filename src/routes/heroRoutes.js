const Joi = require('joi')
const Boom = require('boom')
const BaseRoute = require('./base/baseRoute');
const failAction = (request, headers, erro) => {
    throw erro;
}; 
class HeroRoutes extends BaseRoute {
    constructor(db) {
        super();
        this._db = db;
    }
    list() {
        return {
            path: '/heroes',
            method: 'GET',
            config:{
                tags: ['api'],
                description: 'Deve listar heróis',
                notes: 'Pode paginar resultados e filtrar por nome',
                validate:{
                    failAction,
                    query:{
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(1000)
                    }
                }
            },
            handler: (request, headers) => {
                try {
                    const { skip, limit, nome } = request.query;
                    const query = nome ? { nome: { $regex: `.*${nome}*.`} }: {};
                    
                    return this._db.read(query, parseInt(skip), parseInt(limit));
                } catch (error) {
                    
                    console.log('It`s Bad ', error);
                    return Boom.internal();
                }
            }
        }
    }
    create(){
        return {
            path: '/heroes',
            method: 'POST',
            config: {
                tags: ['api'],
                description: 'Deve cadastrar heróis',
                notes: 'Deve cadastrar herói por nome e poder',
                validate: {
                    failAction,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(100)
                    }
                },
                handler: async (request) => {
                    try {
                        const { nome, poder } = request.payload;
                        const result = await this._db.insert({nome, poder});
                        return {
                            message: 'Herói cadastrado com sucesso!',
                            _id: result._id
                        };

                    } catch (error) {
                        console.log('It`s bad', error);
                        return Boom.internal();
                    }
                }
            }
        }
    }

    update(){
        return {
            path: '/heroes/{id}',
            method: 'PATCH',
            config:{
                tags: ['api'],
                description: 'Deve atualizar herói por id',
                notes: 'Pode atualizar qualquer campo',
                validate:{
                    failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload:{
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(100)
                    }
                }
            },
            handler: async (request) => {
                try{
                    const { id} = request.params;
                    const { payload } = request;
                    const dadosString = JSON.stringify(payload);
                    const dados = JSON.parse(dadosString);
                    const result = await this._db.update(id, dados);
                    
                    if(result.nModified !== 1){
                      return Boom.preconditionFailed('Id não encotrado no banco.')
                    }


                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
                } catch (error) {
                    console.error('It`s Bad', error);
                    return Boom.internal();
                }
            }

        }
    }
    delete(){
        return {
            path: '/heroes/{id}',
            method: 'DELETE',
            config:{
                tags: ['api'],
                description: 'Deve remover herói por id',
                notes: 'O id tem que ser valido.',
                validate:{
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {

                try {
                    const {id} = request.params;
                    const result = await this._db.delete(id);
                   
                    if(result.deletedCount === 0) {
                        return Boom.preconditionFailed('Id não encotrado no banco.');
                    }
                    return { message: 'Heroi removido com sucesso!' }

                } catch (error) {
                    console.error('It`s Bad', error);
                    return Boom.internal();
                }
          
        }
        }
    }
}

module.exports = HeroRoutes;