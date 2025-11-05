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
const queryBuilder = require('../utils/queryBuilder');


const getUsers = async (req, res) => {
    try {

        const userId = req.params.id;
        if (!userId) {
            logger.warn("Users/getProfiles: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        }

        const user = await getUserById(userId);

        if (!user) {
            logger.warn("Users/getProfiles: Not found user!", { ip: req.ip, email: user.email });
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
        if (!userId) {
            logger.warn("Users/getProfiles: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        }

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

        const queryOptions = queryBuilder(
            req.query,
            ["role", "isVerified"],         // allowedFilters
            ["username", "createdAt"],       // allowedSortFields
            ["username", "email"]            // searchableFields
        );

        console.log(queryOptions);

        const { count, rows } = await getAllUser(queryOptions);

        logger.info("Users/getAllUsers: Get all users successfully!")
        return successResponse(res, 200, "Lấy tất cả người dùng thành công!", rows, {
            total: count,
            page: queryOptions.page,
            limit: queryOptions.limit,
            totalPages: Math.ceil(count / queryOptions.limit),
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
            logger.warn("Users/createUsers: User already exists!", { ip: req.ip, email: existUser.email });
            return errorResponse(res, 403, "User already exists!");
        }

        const passwordHash = await hashPass(password);
        const newUser = await createUser({ username, email, passwordHash, isVerified });

        logger.info("Users/createUsers: Created user successfully!", { ip: req.ip, email: user.email });
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

        if (!userId) {
            logger.warn("Users/getProfiles: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        }

        const user = await getUserById(userId);
        if (!user) {
            logger.warn("Users/updateUsers: Not found user!", { ip: req.ip, email: user.email });
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        }
        const updatedUser = await updateUser(user, { username, phone, dob });

        logger.info("User/updateUser: Update successfully!", { ip: req.ip, email: user.email });
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

        if (!userId) {
            logger.warn("Users/getProfiles: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        }

        const user = await getUserById(userId);

        if (!user) {
            logger.warn("User/updateRole: Not found user!", { ip: req.ip, email: user.email })
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        };

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
        if (!userId) {
            logger.warn("Users/getProfiles: User id undefined!");
            errorResponse(res, 400, "Thiếu id người dùng!");
        }

        const user = await getUserById(userId);
        if (!user) {
            logger.warn("Users/getProfiles: Not found user!", { ip: req.ip, email: user.email });
            return errorResponse(res, 404, "Không tìm thấy người dùng!");
        }

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
