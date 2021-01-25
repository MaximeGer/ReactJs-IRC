module.exports = app => {
    const channels = require("../controllers/channels.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Channel
    router.post("/", channels.create);
  
    // Retrieve a single Channel with id
    router.get("/byID/:id", channels.findById);

    // Retrieve a single Channel with id
    router.get("/byName/:name", channels.findByName);
  
    // Update a Channel with id
    router.put("/:id", channels.update);
  
    // Delete a Channel with name
    router.delete("/:name", channels.delete);
  
    // Delete all Channels
    router.delete("/", channels.deleteAll);
    
    router.get("/regex", channels.findByRegex)
  
    app.use('/api/channels', router);
  };