const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { checkoutController } = require("../controllers/checkoutController");

const router = express.Router();

router.post("/checkout", authMiddleware, checkoutController);

module.exports = router;
