const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
var router = require("express").Router();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  router.get("/test", controller.allAccess);

  // Retrieve all Messages
  router.get("/", controller.findAll);

  // Retrieve a single Message with id
  router.get("/:id", controller.findOne);

  // Update a Message with id
  router.put("/:id", controller.update);

  // Delete a Message with id
  router.delete("/:id", controller.delete);

  // Delete all Messages
  router.delete("/", controller.deleteAll);

  app.use("/api/users", router)
};