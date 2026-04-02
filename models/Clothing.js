const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    category: { type: [String], required: true },
    price: { type: String, required: true },
    priceVal: { type: Number, required: true },
    size: { type: [String], required: true },
    image: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Clothing', clothingSchema);