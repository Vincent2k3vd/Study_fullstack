module.exports = (sequelize, DataTypes) => {
    const RefreshTokens = sequelize.define("RefreshTokens", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userAgent: {
            type: DataTypes.STRING,
        },
        ipAddress: {
            type: DataTypes.STRING,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    RefreshTokens.associate = (models) => {
        RefreshTokens.belongsTo(models.Users, {
            foreignKey: "userId",
            as: "user",
            onDelete: "CASCADE",
        });
    };

    return RefreshTokens;
};
