const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            clothingId: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: String, required: true },
            priceVal: { type: Number, required: true },
            image: { type: String, required: true },
            size: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            
            // --- NEW: Added Borrow Dates ---
            startDate: { type: String, required: true },
            endDate: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model('Cart', cartSchema);