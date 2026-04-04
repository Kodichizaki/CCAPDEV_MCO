const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: Array, 
    totalAmount: Number, 
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' } 
});

module.exports = mongoose.model('Order', orderSchema);