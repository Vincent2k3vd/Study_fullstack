const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { registerMiddleware } = require('../middlewares/middleValidation/registerMiddleware');
const adminMiddleware = require('../middlewares/middleRole/adminMiddleware');
const { getProfiles, getAllUsers, createUsers, getUsers, updateRoles, updateUsers } = require('../controllers/userController');

router.get("/:id", authMiddleware, getUsers);
router.get("", authMiddleware, adminMiddleware, getAllUsers);
router.get("/", authMiddleware, getProfiles);
router.post("/", authMiddleware, adminMiddleware, createUsers);
router.patch("/:id", authMiddleware, authMiddleware, updateRoles);
router.patch("/:id", authMiddleware, authMiddleware, updateUsers);

module.exports = router;