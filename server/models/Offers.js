module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Offers", {
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
          type: DataTypes.STRING,
          allowNull: true
      },
      descriptionlong: {
          type: DataTypes.STRING(3000),
          allowNull: true
      },
      
  }); 
};