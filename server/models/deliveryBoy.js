// /Users/karanpaigude/Desktop/projects/Washwagon/server/models/DeliveryBoy.js
const mongoose = require('mongoose');

const DeliveryBoySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    deliveryArea: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
}, {
    timestamps: true,  // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('DeliveryBoy', DeliveryBoySchema);
