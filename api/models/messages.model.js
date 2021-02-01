module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
      message: {
        type: Sequelize.STRING
      },
      idchannel: {
        type: Sequelize.INTEGER
      },
      author: {
        type: Sequelize.STRING
      },
      namechannel: {
        type: Sequelize.STRING
      }
    });
  
    return Message;
  };