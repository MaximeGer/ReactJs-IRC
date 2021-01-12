module.exports = app => {
    const channels = require("../controllers/channels.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Channel
    router.post("/", channels.create);
  
    // Retrieve all Channels
    router.get("/", channels.findAll);
  
    // Retrieve a single Channel with id
    router.get("/:id", channels.findById);

    // Retrieve a single Channel with id
    router.get("/:name", channels.findByName);
  
    // Update a Channel with id
    router.put("/:id", channels.update);
  
    // Delete a Channel with name
    router.delete("/:name", channels.delete);
  
    // Delete all Channels
    router.delete("/", channels.deleteAll);
  
    app.use('/api/channels', router);
  };