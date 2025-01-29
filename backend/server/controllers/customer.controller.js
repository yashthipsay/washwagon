const Customer = require('../models/Customer'); // Assuming this is the correct path
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For JWT authentication

// Create a new customer (signup)
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the customer already exists
        let customer = await Customer.findOne({ email });
        if (customer) {
            return res.status(400).json({ msg: 'Customer already exists' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new customer
        customer = new Customer({
            name,
            email,
            password: hashedPassword,
        });

        // Save customer to the database
        await customer.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set JWT as an HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour
        });

        // Return the customer details without the password
        const { password: _, ...customerWithoutPassword } = customer.toObject();
        res.status(201).json({ customer: customerWithoutPassword, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all customers
exports.getUsers = async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers

        // Remove password from customer details before sending
        const customersWithoutPassword = customers.map(customer => {
            const { password, ...customerWithoutPassword } = customer.toObject();
            return customerWithoutPassword;
        });

        res.json(customersWithoutPassword); // Send customer list without passwords
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Login for customer
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the customer exists
        let customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: customer._id, email: customer.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set JWT as an HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000, // 1 hour
        });

        // Return the customer details without the password
        const { password: _, ...customerWithoutPassword } = customer.toObject();
        res.json({ customer: customerWithoutPassword, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
