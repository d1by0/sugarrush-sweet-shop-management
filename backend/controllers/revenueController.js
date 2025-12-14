const Revenue = require("../models/revenueModel");

// ADMIN: Get total revenue
exports.getRevenueController = async (req, res) => {
  try {
    let revenue = await Revenue.findOne();
    if (!revenue) {
      revenue = await Revenue.create({ totalRevenue: 0 });
    }

    res.status(200).send({
      success: true,
      totalRevenue: revenue.totalRevenue,
    });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// INTERNAL: Add revenue on checkout
exports.addRevenue = async (amount) => {
  let revenue = await Revenue.findOne();
  if (!revenue) {
    revenue = await Revenue.create({ totalRevenue: 0 });
  }

  revenue.totalRevenue += amount;
  await revenue.save();
};
