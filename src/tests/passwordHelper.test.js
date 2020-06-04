
const assert = require('assert')
const PasswordHelper = require('./../helpers/passwordHelper')
const SENHA = 'eicke@987'
const HASH = '$2b$04$XxtZ1qk65.pITab9JpUTN.JeJ/17mtcwkxQRyhhhM1uVLUqfOv./S'
describe('User Helper Test Suit', function() {
    this.beforeAll(async () => {

    });
    it('deve gerar um hash a parti de uma senha', async ()=>{
        const result = await PasswordHelper.hashPassword(SENHA);
        assert.ok(result.length > 10);
    });
    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(SENHA, HASH);
        assert.ok(result);
    })
})