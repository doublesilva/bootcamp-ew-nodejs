const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },
        poder: {
            type: String,
            required: true
        },
        insertedAt:{
            type: Date,
            default: new Date()
        }

    }
);

module.exports = mongoose.model.heroes || mongoose.model('heroes', heroSchema); 