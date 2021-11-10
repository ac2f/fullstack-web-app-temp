module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Faqs", {
        itemId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(10000),
            allowNull: false
        }
    })
}