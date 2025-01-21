const DeliveryBoy = require('../models/deliveryBoy');
const Order = require('../models/OrderDetails'); // Assuming you have an Order model

exports.createDeliveryBoy = async (req, res) => {
    const { name, email, password, phoneNumber, deliveryArea, vehicleType, licenseNumber } = req.body;

    // Validate required fields (making deliveryArea optional)
    if (!name || !email || !password || !phoneNumber || !vehicleType || !licenseNumber) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required: name, email, password, phoneNumber, vehicleType, licenseNumber',
        });
    }

    try {
        // Create new delivery boy, set deliveryArea to null if it's not provided
        const newDeliveryBoy = new DeliveryBoy({
            name,
            email,
            password,
            phoneNumber,
            deliveryArea: deliveryArea || null,  // Set deliveryArea to null if not provided
            vehicleType,
            licenseNumber,
        });

        await newDeliveryBoy.save();

        res.status(201).json({
            success: true,
            message: 'Delivery boy created successfully',
            deliveryBoy: newDeliveryBoy,
        });
    } catch (err) {
        console.error('Error creating delivery boy:', err.message);
        res.status(500).json({
            success: false,
            error: 'Server error while creating delivery boy',
        });
    }
};


// Get all delivery boys
exports.getDeliveryBoys = async (req, res) => {
    try {
        const deliveryBoys = await DeliveryBoy.find();
        res.status(200).json({
            success: true,
            deliveryBoys,
        });
    } catch (err) {
        console.error('Error fetching delivery boys:', err.message);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching delivery boys',
        });
    }
};

// Assign an order to a delivery boy
exports.assignOrderToDeliveryBoy = async (req, res) => {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
        return res.status(400).json({
            success: false,
            error: 'Order ID and Delivery Boy ID are required',
        });
    }

    try {
        // Find the order and the delivery boy
        const order = await Order.findById(orderId);
        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

        if (!order || !deliveryBoy) {
            return res.status(404).json({
                success: false,
                error: 'Order or Delivery Boy not found',
            });
        }

        // Check if the order is already assigned
        if (order.assignedTo) {
            return res.status(400).json({
                success: false,
                error: 'Order is already assigned to another delivery boy',
            });
        }

        // Assign the order to the delivery boy
        order.assignedTo = deliveryBoyId;
        await order.save();

        // Add the order to the delivery boy's assigned orders (match schema)
        if (!deliveryBoy.assignedOrders) deliveryBoy.assignedOrders = [];
        deliveryBoy.assignedOrders.push(orderId);
        await deliveryBoy.save();

        res.status(200).json({
            success: true,
            message: 'Order successfully assigned to the delivery boy',
            order,
        });
    } catch (err) {
        console.error('Error assigning order to delivery boy:', err.message);
        res.status(500).json({
            success: false,
            error: 'Server error while assigning order to delivery boy',
        });
    }
};


exports.signupDeliveryBoy = async (req, res) => {
    const { name, email, password, phoneNumber, vehicleType, licenseNumber, deliveryArea } = req.body;

    console.log(req.body);  // Log the incoming request body

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !vehicleType || !licenseNumber) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required: name, email, password, phoneNumber, vehicleType, licenseNumber',
        });
    }

    try {
        // Check if the delivery boy already exists
        const existingDeliveryBoy = await DeliveryBoy.findOne({ email });
        if (existingDeliveryBoy) {
            return res.status(400).json({
                success: false,
                error: 'Delivery boy with this email already exists',
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new delivery boy, set deliveryArea to null if it's not provided
        const newDeliveryBoy = new DeliveryBoy({
            name,
            email,
            password: hashedPassword,  // Use hashed password
            phoneNumber,
            vehicleType,
            licenseNumber, // Set licenseNumber to null if not provided
            deliveryArea: deliveryArea || null,  // Set deliveryArea to null if not provided
        });
        await newDeliveryBoy.save();

        res.status(201).json({
            success: true,
            message: 'Delivery boy created successfully',
            deliveryBoy: newDeliveryBoy,
        });
    } catch (err) {
        console.error('Error signing up delivery boy:', err.message);
        res.status(500).json({
            success: false,
            error: 'Server error while signing up delivery boy',
        });
    }
};
