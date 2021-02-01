module.exports = app => {
    const messages = require("../controllers/messages.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Message
    router.post("/", messages.create);
  
    // Retrieve all Messages
    router.get("/", messages.findAll);
  
    // Retrieve all published Messages in a channel
    router.get("/allByChannel/:name", messages.findAllByChannel);

    // Retrieve 20 published Messages in a channel
    router.get("/20ByChannel/:name", messages.find20ByChannel);
  
    // Retrieve a single Message with id
    router.get("/:id", messages.findOne);
  
    // Update a Message with id
    router.put("/:id", messages.update);
  
    // Delete a Message with id
    router.delete("/:id", messages.delete);
  
    // Delete all Messages
    router.delete("/", messages.deleteAll);
  
    app.use('/api/messages', router);
  };