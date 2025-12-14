const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  totalRevenue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Revenue", revenueSchema);
