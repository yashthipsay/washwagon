// /Users/karanpaigude/Desktop/projects/Washwagon/server/controllers/deliveryBoyController.js
const DeliveryBoy = require('../models/deliveryBoy');

// Create a new delivery boy
exports.createDeliveryBoy = async (req, res) => {
    const { name, email, password, phoneNumber, deliveryArea } = req.body;
    try {
        const newDeliveryBoy = new DeliveryBoy({ name, email, password, phoneNumber, deliveryArea });
        await newDeliveryBoy.save();
        res.status(201).json(newDeliveryBoy);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all delivery boys
exports.getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await DeliveryBoy.find();
        res.json(deliveryBoys);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
