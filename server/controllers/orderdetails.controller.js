const Order = require('../models/OrderDetails');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { customerId, items, totalAmount, orderDate, status } = req.body;

        // Check if required fields are present
        if (!customerId || !items || !totalAmount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        // Ensure the customerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid customer ID format',
            });
        }

        const order = new Order({
            customer: customerId,
            items,
            totalAmount,
            orderDate: orderDate || new Date(),
            status: status || 'Pending',
        });

        await order.save();
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order,
        });
    } catch (err) {
        console.error('Error creating order:', err.message || err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: err.message || err,  // Additional details for debugging
        });
    }
};

// Get order details by order ID
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate('customer', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found',
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (err) {
        console.error('Error fetching order details:', err.message || err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: err.message || err,  // Additional details for debugging
        });
    }
};

const getOrdersByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({
                success: false,
                error: 'Customer ID is required',
            });
        }

        // Ensure the customerId is valid
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid customer ID format',
            });
        }

        // Check if the customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }

        console.log('Customer found:', customer);  // Log the customer for debugging

        // Try to find orders for the customer
        let orders = await Order.find({ customer: customerId }).populate('customer', 'name email');

        if (orders.length === 0) {
            // If no orders are found, create a default order
            console.log('No orders found. Creating new order for customer:', customerId);

            const newOrder = new Order({
                customer: customerId,
                items: [],  // Default empty items or add a default set of items if necessary
                totalAmount: 0,  // Default amount or calculate a default value
                orderDate: new Date(),
                status: 'Pending',
            });

            // Save the new order to the database
            await newOrder.save();
            orders = [newOrder];  // Set the new order to be the result
        }

        // Log the orders to confirm
        console.log('Orders for customer:', orders);

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (err) {
        console.error('Error fetching customer orders:', err.message || err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: err.message || err,  // Additional details for debugging
        });
    }
};






const updateOrderDetails = async (req, res) => {
    try {
        const { customerId, selectedOption } = req.body;

        // Check if customerId and selectedOption are provided
        if (!customerId || !selectedOption) {
            return res.status(400).json({
                success: false,
                error: 'Customer ID and selected option are required',
            });
        }

        // Ensure that customerId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid customer ID format',
            });
        }

        // Ensure that the customer exists
        const customerExists = await Customer.findById(customerId);
        if (!customerExists) {
            return res.status(404).json({
                success: false,
                error: 'Customer not found',
            });
        }

        // Check if an existing order exists for the customer
        let existingOrder = await Order.findOne({ customer: customerId });

        if (existingOrder) {
            // If order exists, update the order with the selected option
            existingOrder.laundryType = selectedOption;
            const updatedOrder = await existingOrder.save();

            return res.status(200).json({
                success: true,
                message: 'Order updated successfully',
                order: updatedOrder,
            });
        } else {
            // If no order exists, create a new order with the selected option
            const newOrder = new Order({
                customer: customerId,
                items: [],  // Default empty items or add a default set of items if necessary
                totalAmount: 0,  // Default amount or calculate a default value
                orderDate: new Date(),
                status: 'Pending',
                laundryType: selectedOption,  // Store the selected option directly
            });

            // Save the new order to the database
            await newOrder.save();

            return res.status(201).json({
                success: true,
                message: 'New order created successfully',
                order: newOrder,
            });
        }
    } catch (error) {
        console.error('Error updating order details:', error.message || error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error.message || error,  // Additional details for debugging
        });
    }
};


module.exports = {
    createOrder,
    getOrderDetails,
    getOrdersByCustomer,
    updateOrderDetails,
};
