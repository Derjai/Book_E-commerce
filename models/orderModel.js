const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: { type: Date, required: true },
    status: { type: String, enum: ['On Progress', 'Canceled', 'Completed'],default: 'On Progress', required: true },
    details: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true }],
    total: { type: Number, required: true },
    addressee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deletedOn: {type: Date, required: false}
}, { timestamps: true });

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;