const { Op } = require('sequelize');

/**
*
* @param {object} query - req.query
* @param {Array<string>} allowedFilters
* @param {Array<string>} allowedSortFields
* @param {Array<string>} searchableFields
  */
const queryBuilder = (query = {}, allowedFilters = [], allowedSortFields = [], searchableFields = []) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "DESC",
        search,
        ...filters
    } = query;

    const where = {};

    for (const [key, value] of Object.entries(filters)) {
        if (allowedFilters.includes(key)) {
            where[key] = value;
        }
    }

    if (search && searchableFields.length > 0) {
        where[Op.or] = searchableFields.map((field) => ({
            [field]: { [Op.like]: `%${search}%` },
        }));
    }

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Number(limit) || 10, 100);
    const offset = (safePage - 1) * safeLimit;

    const safeOrderField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";
    const safeOrderDirection = ["ASC", "DESC"].includes(order.toUpperCase())
        ? order.toUpperCase()
        : "DESC";

    return {
        where,
        page: safePage,
        limit: safeLimit,
        offset,
        order: [[safeOrderField, safeOrderDirection]],
    };
};

module.exports = queryBuilder;
