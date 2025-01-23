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
        required: false,
    },
    vehicleType: {
        type: String,
        required: false,  // New field added
    },
    licenseNumber: {
        type: String,
        required: true,  // New field added
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available',
    },
    assignedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderDetails',  // Link to OrderDetails collection
    }],
}, {
    timestamps: true,  // Adds createdAt and updatedAt timestamps
});

// Method to assign an order to the delivery boy
DeliveryBoySchema.methods.assignOrder = async function (orderId) {
    if (!this.assignedOrders.includes(orderId)) {
        this.assignedOrders.push(orderId);
        await this.save();
    }
};

// Method to remove an order from the delivery boy's assignments
DeliveryBoySchema.methods.removeOrder = async function (orderId) {
    this.assignedOrders = this.assignedOrders.filter(order => order.toString() !== orderId.toString());
    await this.save();
};

module.exports = mongoose.model('DeliveryBoy', DeliveryBoySchema);
