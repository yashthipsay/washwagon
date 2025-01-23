const mongoose = require('mongoose');

const OrderDetailsSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    laundryType: {
        type: String,
        enum: ['wash', 'dry-clean', 'iron', 'fold'], // Restricts the laundryType to specific options
        default: null, // Default to null if not provided
    },
    status: {
        type: String,
        default: 'Pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Prevent overwriting the OrderDetails model if it already exists
const OrderDetails =
    mongoose.models.OrderDetails || mongoose.model('OrderDetails', OrderDetailsSchema);

module.exports = OrderDetails;
