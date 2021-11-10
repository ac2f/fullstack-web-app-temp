module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Users", {
        username: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isEmailVerified: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ownerIP: {
            type: DataTypes.STRING,
            allowNull: true
        },
        verificationCode: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};