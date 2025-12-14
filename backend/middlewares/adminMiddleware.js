module.exports = (req, res, next) => {
    try {
        // authMiddleware must run before this
        if (!req.user || req.user.usertype !== "admin") {
            return res.status(403).send({
                success: false,
                message: "Admin access required",
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in admin middleware",
        });
    }
};
