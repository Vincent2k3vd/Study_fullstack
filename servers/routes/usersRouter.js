const express = require('express');
const { getProfile, getAllUser } = require('../controllers/userController');
const router = express.Router();

router.get("/:id", getProfile);
router.get("/", getAllUser);

module.exports = router;