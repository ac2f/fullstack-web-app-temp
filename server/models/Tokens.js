module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Tokens", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isDesktopDevice: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tokenIP: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};