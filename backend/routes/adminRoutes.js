const express = require("express");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const { getRevenueController } = require("../controllers/revenueController");

const router = express.Router();

router.get("/revenue", auth, admin, getRevenueController);

module.exports = router;
