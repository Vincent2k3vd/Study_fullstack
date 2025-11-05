const logger = require('../utils/logger');
const { hashPass } = require("../utils/hashing/hashingPassword");
const { successResponse, errorResponse } = require('../utils/response');
const {
    updateUser,
    getProfile,
    getAllUser,
    getUserByEmail,
    createUser,
    getUserById,
    updateRole,
    deleteUser,
} = require('../services/userService');


const getUsers = async (req, res) => {
    try {

        const userId = req.params.id;
        const user = await getUserById(userId);

        if (!user) {
            logger.warn("Users/getProfiles: Not found user!", { ip: req.ip });
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        }

        logger.info("Users/getUsers: Get user successfully!", { ip: req.ip, email: user.email });
        return successResponse(res, 200, "Lấy thông tin người dùng thành công!", user);
    } catch (error) {
        logger.error("Users/getUsers: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};

const getProfiles = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await getProfile(userId);
        if (!user) {
            logger.warn("Users/getProfiles: Not found user!", { ip: req.ip, email: user.email });
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        }

        logger.info("Users/getProfiles: Get profile successfully!", { ip: req.ip, email: user.email });
        return successResponse(res, 200, "Lấy thông tin thành công!", user);
    } catch (error) {
        logger.error("Users/getProfiles: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};

const getAllUsers = async (req, res) => {
    try {
        const search = req.query.search || '';
        const limit = Number(req.query.limit) || 10;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const { count, rows } = await getAllUser(search, limit, offset);
        logger.info("Users/getAllUsers: Get all users successfully!")
        return successResponse(res, 200, "Lấy tất cả người dùng thành công!", rows, {
            total: count,
            page,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        logger.error("Users/getAllUsers: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};

const createUsers = async (req, res) => {
    try {
        const { username, email, password, isVerified } = req.body;
        const existUser = await getUserByEmail(email);

        if (existUser) {
            logger.warn("Users/createUsers: User already exists!", { ip: req.ip, email });
            return errorResponse(res, 403, "User already exists!");
        }

        const passwordHash = await hashPass(password);
        const newUser = await createUser({ username, email, passwordHash, isVerified });

        logger.info("Users/createUsers: Created user successfully!", { ip: req.ip, email });
        return successResponse(res, 201, "Tạo người dùng thành công!", newUser);
    } catch (error) {
        logger.error("Users/createUsers: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};

const updateUsers = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, phone, dob } = req.body;
        console.log(Date(dob));
        const user = await getUserById(userId);
        if (!user) return errorResponse(res, 404, "Not found user!");

        const updatedUser = await updateUser(user, { username, phone, dob });
        logger.info("User/updateUser: Update successfully!", { ip: req.ip, id: userId });

        return successResponse(res, 200, "Cập nhật thành công!", updatedUser);
    } catch (error) {
        logger.error("User/updateUser: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};

const updateRoles = async (req, res) => {
    try {

        const userId = req.params.id;

        const { role } = req.body;

        const user = await getUserById(userId);

        if (!user) return errorResponse(res, 404, "Not found user!");

        await updateRole(user, role);

        logger.info("User/updateRole: Updated successfully!", { ip: req.ip, email: user.email });
        return successResponse(res, 200, "Cập nhật vai trò thành công!");
    } catch (error) {
        logger.error("User/updateRole: Server error!", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
};


const deleteUsers = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await getUserById(userId);

        await deleteUser(user);

        logger.info("User/deleteUsers: Delete user successfully!", { ip: req.ip, email: user.email });
        return successResponse(res, 200, "Xóa người dùng thành công!");
    } catch (error) {
        logger.error("Users/deleteUsers: Server error", { ip: req.ip, error: error.message, stack: error.stack });
        return errorResponse(res, 500, "Lỗi máy chủ! Vui lòng thử lại sau.");
    }
}

module.exports = {
    getUsers,
    getProfiles,
    getAllUsers,
    createUsers,
    updateUsers,
    updateRoles,
    deleteUsers
};
