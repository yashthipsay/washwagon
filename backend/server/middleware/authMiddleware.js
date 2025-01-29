const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt; // Read JWT from cookies

    if (!token) {
        return res.status(401).json({ msg: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.customer = decoded; // Attach decoded user info to the request
        next(); // Continue to the next middleware/controller
    } catch (err) {
        return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }
};
