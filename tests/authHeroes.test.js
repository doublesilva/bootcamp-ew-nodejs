const assert = require('assert');
const api = require('./../api')
const ContextHelper = require('./../src/helpers/contextHelper')
const UserSchema = require('./../src/bd/strategies/postgres/schema/userSchema')

let app = {}
let context = {};
const USER = {
    username: 'xuxadasilva',
    password: '123'
};

const USER_DB = {
    ...USER,
    password: '$2b$04$WfL.ydwNYhtpY/KuhYHFz.tAB9eD.5y4LoxEvmS2b4Ej8SjwZ4YXq'
};
describe('Auth test suite', function(){
    this.beforeAll(async () => {
        app = await api;
        
        const context = await ContextHelper.ContextPostgress(UserSchema);

        const result = await context.update(null, USER_DB, true);
        const userInserted = await context.read({username: USER_DB.username});
    })

    it('deve obter um token', async() => {
        const result = await app.inject({
            method: 'POST', 
            url: '/login',
            payload: USER
        });
        const statusCode = result.statusCode;
        const data =  JSON.parse(result.payload);
        assert.deepEqual(statusCode, 200);
        assert.ok(data.token.length > 10);
    });

    it('deve retornar não autorizado para usuário incorreto', async () => { 
        const expected = {
            statusCode: 401,
            error: 'Unauthorized',
            message: 'Usuário informado não encontrado!'
          };
          const userIncorrect = { ...USER, username: 'XPTO'};
          const result = await app.inject({
              method: 'POST',
              url: '/login',
              payload: userIncorrect
          });
          const data = JSON.parse(result.payload);         
          assert.deepEqual(result.statusCode, 401);          
          assert.deepEqual(data, expected)
    });
})

