module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isverify: {
            type: DataTypes.TINYINT(1),
            defaultValue: 0
        },
        role: {
            type: DataTypes.INTEGER,
            nums: [1, 2, 3],
            defaultValue: 1
        }
    }, {
        tamplate: true,
    });

    return Users
}