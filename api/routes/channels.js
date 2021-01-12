module.exports = app => {
    const channels = require("../controllers/channels.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Message
    router.post("/", channels.create);
  
    // Retrieve all Messages
    router.get("/", channels.findAll);
  
    // Retrieve a single Message with id
    router.get("/:id", channels.findOne);
  
    // Update a Message with id
    router.put("/:id", channels.update);
  
    // Delete a Message with id
    router.delete("/:id", channels.delete);
  
    // Delete all Messages
    router.delete("/", channels.deleteAll);
  
    app.use('/api/channels', router);
  };