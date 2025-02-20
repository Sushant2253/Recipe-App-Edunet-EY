const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    ingredients: [{
        name: String,
        quantity: String,
        unit: String
    }],
    instructions: [String],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema); 