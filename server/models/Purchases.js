module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Purchases", {
        buyer: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};