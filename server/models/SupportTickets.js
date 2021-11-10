module.exports = (sequelize, DataTypes) => {
    return sequelize.define("SupportTickets", {
        ticketID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sentMessage: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        messageSender: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};