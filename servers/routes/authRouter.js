const express = require('express');
const { register, login, logout, googleLogin, verifyAccount } = require('../controllers/authController');
const router = express.Router({ mergeParams: true });
const registerMiddleware = require('../middlewares/middleValidation/registerMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');


router.get("/verify/:token", verifyAccount);
router.post("/signup", registerMiddleware, register);
router.post("/signin", login);
router.post("/google", googleLogin);
router.post("/logout", authMiddleware, logout);


module.exports = router;