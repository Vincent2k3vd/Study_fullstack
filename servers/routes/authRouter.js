const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router({ mergeParams: true });
const registerMiddleware = require('../middlewares/middleValidation/registerMiddleware')

router.post("/signup", registerMiddleware, register);
router.post("/signin", login);

module.exports = router;