const { addRevenue } = require("./revenueController");

exports.checkoutController = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({
        success: false,
        message: "Invalid amount",
      });
    }

    // ✅ UPDATE REVENUE IN DB
    await addRevenue(amount);

    res.status(200).send({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Checkout failed",
    });
  }
};
