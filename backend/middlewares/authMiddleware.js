const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        // DEBUG LINE 
        console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token missing",
            });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }
};
