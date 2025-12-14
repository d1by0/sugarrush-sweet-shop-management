const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  createSweetController,
  getAllSweetsController,
  searchSweetsController,
  updateSweetController,
  deleteSweetController,
  purchaseSweetController,
  restockSweetController,
} = require("../controllers/sweetController");

// PUBLIC
router.get("/", getAllSweetsController);
router.get("/search", searchSweetsController);

// USER
router.post("/:id/purchase", authMiddleware, purchaseSweetController);

// ADMIN
router.post("/", authMiddleware, adminMiddleware, createSweetController);
router.put("/:id", authMiddleware, adminMiddleware, updateSweetController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweetController);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweetController);

module.exports = router;
