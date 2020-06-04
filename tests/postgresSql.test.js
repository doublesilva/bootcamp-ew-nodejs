const assert = require('assert');
const PostgresSql = require('./../src/bd/strategies/postgres/postgresSqlStrategy');
const HeroSchema = require('./../src/bd/strategies/postgres/schema/heroSchema');
const Context = require('./../src/bd/strategies/base/context.strategy');
const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'flexas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Mulher Gavião', poder: 'grito' };

let context = {}
describe('Postgres Suite Tests', function () {
    this.timeout(Infinity);
    this.beforeAll(async () => {
        const connection = await PostgresSql.connect();

        const model = await PostgresSql.defineModel(connection, HeroSchema);
        context = new Context(new PostgresSql(connection, model));

        await context.delete();
        await context.insert(MOCK_HEROI_CADASTRAR);
        await context.insert(MOCK_HEROI_ATUALIZAR);

    })
    it('Verify Connection', async () => {
        var resultado = await context.isConnected();

        assert.ok(resultado);
    });
    it('insert', async () => {
        const {nome, poder} = await context.insert(MOCK_HEROI_CADASTRAR);
    
        const result = { nome, poder};
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
      });
    
      it('list', async () => {
        const [{nome, poder}] = await context.read(MOCK_HEROI_CADASTRAR);        
        const result = {nome, poder}
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR);
      });
    
      it('update', async () => {
        const [result] = await context.read();
    
        const novoItem = {
          ...MOCK_HEROI_CADASTRAR,
          nome: 'Mulher Maravilha',
        };
        const [update] = await context.update(result.id, novoItem);
    
        assert.deepEqual(update, 1);
      });
    
      it('delete', async () => {
        const [item] = await context.read();
        const result = await context.delete(item.id);
        assert.deepEqual(result, 1);
      });
})