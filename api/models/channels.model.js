module.exports = (sequelize, Sequelize) => {
    const Channel = sequelize.define("channel", {
        name: {
        type: Sequelize.STRING
      },
    });
  
    return Channel;
  };