module.exports = (sequelize, DataTypes) => {
    return sequelize.define("APIVerificationKeys", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        index: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
}