const express = require('express')
const { getUserController, updateUserController, resetPasswordController, updatePasswordController, deleteUserController, getAllAdminsController,
    updateAdminController,
    resetAdminPasswordController,
    updateAdminPasswordController,
    deleteAdminController,promoteToAdminController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');



const router = express.Router();

//routes
// Get user data || GET
router.get('/getUser', authMiddleware, getUserController);

//update profile
router.put('/updateUser', authMiddleware, updateUserController)

//update password
router.put("/updatePassword", authMiddleware, updatePasswordController);

//reset password
router.post("/resetPassword", authMiddleware, resetPasswordController)

//delete user
router.delete("/deleteUser",authMiddleware, deleteUserController);


// promote user → admin
router.put(
  "/promoteToAdmin/:id",
  authMiddleware,
  adminMiddleware,
  promoteToAdminController
);


// UPDATE admin password (logged in) — MUST COME FIRST
router.put(
  "/admin/updatePassword",
  authMiddleware,
  adminMiddleware,
  updateAdminPasswordController
);

// RESET admin password (forgot)
router.post(
  "/admin/resetPassword",
  resetAdminPasswordController
);

// GET all admins
router.get(
  "/admins",
  authMiddleware,
  adminMiddleware,
  getAllAdminsController
);

// UPDATE admin details (DYNAMIC — KEEP LAST)
router.put(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  updateAdminController
);

// DELETE admin (DYNAMIC — KEEP LAST)
router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminController
);

module.exports = router;