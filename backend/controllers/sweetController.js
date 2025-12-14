const sweetModel = require("../models/sweetModel");

// ADD SWEET (ADMIN)
const createSweetController = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || !price) {
      return res.status(400).send({
        success: false,
        message: "All fields required",
      });
    }

    const sweet = await sweetModel.create({
      name,
      category,
      price,
      quantity,
    });

    res.status(201).send({
      success: true,
      message: "Sweet added",
      sweet,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Error adding sweet" });
  }
};

// GET ALL SWEETS (PUBLIC)
const getAllSweetsController = async (req, res) => {
  try {
    const sweets = await sweetModel.find();
    res.status(200).send({ success: true, sweets });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// SEARCH SWEETS
const searchSweetsController = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;
    if (minPrice || maxPrice)
      filter.price = {
        ...(minPrice && { $gte: minPrice }),
        ...(maxPrice && { $lte: maxPrice }),
      };

    const sweets = await sweetModel.find(filter);
    res.status(200).send({ success: true, sweets });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// UPDATE SWEET (ADMIN)
const updateSweetController = async (req, res) => {
  try {
    const sweet = await sweetModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Sweet updated",
      sweet,
    });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// DELETE SWEET (ADMIN)
const deleteSweetController = async (req, res) => {
  try {
    await sweetModel.findByIdAndDelete(req.params.id);
    res.status(200).send({ success: true, message: "Sweet deleted" });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// PURCHASE SWEET
const purchaseSweetController = async (req, res) => {
  try {
    const sweet = await sweetModel.findById(req.params.id);

    if (!sweet || sweet.quantity <= 0) {
      return res.status(400).send({
        success: false,
        message: "Out of stock",
      });
    }

    sweet.quantity -= 1;
    await sweet.save();

    res.status(200).send({
      success: true,
      message: "Sweet purchased",
    });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

// RESTOCK SWEET (ADMIN)
const restockSweetController = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweet = await sweetModel.findById(req.params.id);

    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).send({
      success: true,
      message: "Sweet restocked",
    });
  } catch (error) {
    res.status(500).send({ success: false });
  }
};

module.exports = {
  createSweetController,
  getAllSweetsController,
  searchSweetsController,
  updateSweetController,
  deleteSweetController,
  purchaseSweetController,
  restockSweetController,
};
