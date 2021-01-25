const db = require("../models");
const User = db.user;

checkDuplicateUsername = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      login_name: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }  
    next();
 
  });
};

const verifySignUp = {
  checkDuplicateUsername: checkDuplicateUsername
};

module.exports = verifySignUp;