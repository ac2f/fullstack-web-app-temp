module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Stocks", {
        itemId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        descriptionlong: {
            type: DataTypes.STRING(10000),
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        priceDiscount: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};