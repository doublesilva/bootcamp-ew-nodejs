const assert = require('assert');
const Mongoose = require('mongoose');
const MongoDb = require('./../src/bd/strategies/mongodb/mongodb.strategy');
const HeroSchema = require('./../src/bd/strategies/mongodb/schema/hero.schema');
const Context = require('./../src/bd/strategies/base/context.strategy');

const MOCK_HEROI_CADASTRAR = {
    nome: 'Gaviao Negro',
    poder: 'flexas'
};

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Mulher Maravilha',
    poder: 'força'
};
let MOCK_HEROI_ATUALIZAR_ID = '';
let context = {}
describe('MongoDb Suite Tests', function () {
    this.timeout(Infinity);

    this.beforeAll(async () => {
        const connection = MongoDb.connect();
        context = new Context(new MongoDb(connection, HeroSchema));

        const result = await HeroSchema.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ATUALIZAR_ID = result._id
    });

    it('Verify Connection', async () => {
        const result = await context.isConnected();
        const expected = 'Connected';
        assert.deepEqual(result, expected);
    });

    it('cadastrar', async () => {
        const { nome, poder } = await context.insert(MOCK_HEROI_CADASTRAR)

        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [{ nome, poder }] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome })
        const result = {
            nome, poder
        }
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ATUALIZAR_ID, {
            poder: 'Laço'
        })
        assert.deepEqual(result.nModified, 1)
    })
    it('remover', async () => {
        const result = await context.delete(MOCK_HEROI_ATUALIZAR_ID)
        assert.deepEqual(result.n, 1)
    })
});