// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/middleRole/adminMiddleware');
const registerMiddleware = require('../middlewares/middleValidation/registerMiddleware');

const {
    getProfiles,
    getAllUsers,
    getUsers,
    createUsers,
    updateUsers,
    updateRoles,
    deleteUsers
} = require('../controllers/userController');

/**
 * @route   GET /api/v1/users/me
 * @desc    Lấy thông tin profile của user hiện tại (tự đăng nhập)
 * @access  Private (User)
 */
router.get('/me', authMiddleware, getProfiles);

/**
 * @route   GET /api/v1/users
 * @desc    Lấy danh sách tất cả user (chỉ admin được xem)
 * @access  Private (Admin)
 */
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Lấy thông tin chi tiết 1 user cụ thể
 * @access  Private (Admin)
 */
router.get('/:id', authMiddleware, adminMiddleware, getUsers);

/**
 * @route   POST /api/v1/users
 * @desc    Tạo mới 1 user (do admin tạo)
 * @access  Private (Admin)
 */
router.post('/', authMiddleware, adminMiddleware, registerMiddleware, createUsers);

/**
 * @route   PATCH /api/v1/users/:id
 * @desc    Cập nhật thông tin cá nhân của user (chính user đó hoặc admin)
 * @access  Private (User/Admin)
 */
router.patch('/:id', authMiddleware, updateUsers);

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Cập nhật quyền (role) của user
 * @access  Private (Admin)
 */
router.patch('/:id/role', authMiddleware, adminMiddleware, updateRoles);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Xóa 1 user (chỉ admin)
 * @access  Private (Admin)
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteUsers);

module.exports = router;
