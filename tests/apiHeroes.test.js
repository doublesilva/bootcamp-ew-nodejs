const assert = require('assert');
const api = require('./../api');

let app = {};
const Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InhVWEFEQVNJTFZBIiwiaWQiOjEzLCJpYXQiOjE1OTEyOTUwNDN9.KOeqiEVn8S5dtt1KMQCGR_0Jq7NYDQIQjpfYfppP-HM';
const headers = {
    Authorization: Token
}
const MOCK_HERIO_CADASTRAR = { nome: 'Chapolin Colorado - ' + new Date().getUTCMilliseconds(), poder: 'Marreta Bionica'}
const MOCK_HERIO_INICIAL = { nome: 'Super Choque - ' + new Date().getUTCMilliseconds(), poder: 'Eletricidade'}
let MOCK_ID = '';
describe('Api Heroes Suite Tests', function () {
    this.beforeAll(async () => {
        app = await api;
        const result = await app.inject({
            method: 'POST',
            headers,
            payload: MOCK_HERIO_INICIAL,
            url: '/heroes'
        });
        const { _id } = JSON.parse(result.payload);
        MOCK_ID = _id;
    });

    it('listar /heroes', async () => {

        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/heroes'
        });
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.ok(Array.isArray(data));


    });

    it('listar /heroes deve retornar somente 3 registros', async () => {
        const TAMANHO_LIMITE = 3;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
        })
        
        const data = JSON.parse(result.payload);
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(data.length, TAMANHO_LIMITE);


    })
    it('listar /heroes deve retornar um erro com limit incorreto', async () => {
        const TAMANHO_LIMITE = `A`
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}`
        })
        
        const erroResult = {"statusCode":400,"error":"Bad Request","message":"child \"limit\" fails because [\"limit\" must be a number]","validation":{"source":"query","keys":["limit"]}};

        assert.deepEqual(result.statusCode, 400);
        assert.deepEqual(result.payload, JSON.stringify(erroResult));
       

    })

    it('listar /heroes deve filtrar por nome', async () => {
        const TAMANHO_LIMITE = 1000
        const NAME = MOCK_HERIO_INICIAL.nome;
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/heroes?skip=0&limit=${TAMANHO_LIMITE}&nome=${NAME}`
        })
        
         const data = JSON.parse(result.payload);
         const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.deepEqual(data.length, 1);
        assert.deepEqual(data[0].nome, NAME);


    })

    it('cadastrar POST - /heroes', async() => {
        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            headers,
            payload: MOCK_HERIO_CADASTRAR
        });
        const { message, _id } = JSON.parse(result.payload)
        const statusCode = result.statusCode;
        assert.deepEqual(statusCode, 200);
        assert.notStrictEqual(_id, undefined);
        assert.deepEqual(message, 'Herói cadastrado com sucesso!')
    })

    it('atualizar PATCH - /heroes/:id', async() => {
        const _id = MOCK_ID;
        const expecteed = {
            poder: 'Super Mira'
        };
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            headers,
            payload: expecteed
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
       
        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, 'Heroi atualizado com sucesso!')
    })

    it('atualizar PATCH - /heroes/:id - não deve atuaizar com ID incorreto', async() => {
        const _id = `5ed80aefc7f4eb325899cd41`;
        const expecteed = {
            poder: 'Super Mira'
        };
        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            headers,
            payload: expecteed
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
        const expecteedErro = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encotrado no banco.'
          };
        assert.ok(statusCode === expecteedErro.statusCode);
        assert.deepEqual(data, expecteedErro)
    })

    it('atualizar DELETE - /heroes/:id', async() => {
        const _id = MOCK_ID;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
      
        assert.ok(statusCode === 200);
        assert.deepEqual(data.message, 'Heroi removido com sucesso!')
    })

    
    it('atualizar DELETE - /heroes/:id - não deve deletar com ID incorreto', async() => {
        const _id = `5ed80aefc7f4eb325899cd41`;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
        const expecteed = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encotrado no banco.'
          };
        assert.ok(statusCode === expecteed.statusCode);
        assert.deepEqual(data, expecteed)
    })

    it('atualizar DELETE - /heroes/:id - não deve deletar com ID invalido', async() => {
        const _id = `ID_INVALIDO`;
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/heroes/${_id}`
        });
        const statusCode = result.statusCode;
        const data = JSON.parse(result.payload);
        const expecteed = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
          };
        assert.ok(statusCode === expecteed.statusCode);
        assert.deepEqual(data, expecteed)
    })
    

})