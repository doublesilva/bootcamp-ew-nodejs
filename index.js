const mongoose = require('mongoose');

var db = mongoose.connect('mongodb://doublesilva:lapro203@localhost:27017/heroes', { useNewUrlParser: true,  useUnifiedTopology: 
true });

async function Main() {
    const heroSchema = new mongoose.Schema({
        nome: {
            type: String,
            required: true
        },
        poder: {
            type: String,
            required: true
        },
        insertedAt: {
            type: Date,
            default: new Date()
        }

    });

    const collection = mongoose.model('heroes', heroSchema)
    console.log('Schemma', collection.modelName);
    console.log('Schemma', collection.name);
    console.log('Conexao', mongoose.connection.readyState);
    const MOCK_HEROI_CADASTRAR = {
        nome: 'Gaviao Negro',
        poder: 'flexas'
    };
    console.log('Conexao', mongoose.connection.readyState);
   const resultado = await collection.create(MOCK_HEROI_CADASTRAR)
    console.log('Cadatrado', resultado);
    console.log('Conexao', mongoose.connection.readyState);
}

Main()