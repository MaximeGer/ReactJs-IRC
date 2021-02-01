const { sequelize } = require("../models");
const db = require("../models");
const Message = db.messages;
const Op = db.Sequelize.Op;

// Create and Save a new Message
exports.create = (req, res) => {
  // Validate request
  if (!req.body.message) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a message
  const message = {
    message: req.body.message,
    channelTitle: req.body.channelTitle,
    author: req.body.author,
    authorId: req.body.authorId,
    namechannel: req.body.namechannel
  };

  // Save message in the database
  sequelize.query("INSERT INTO messages (`message`, `idchannel`, `author`, `authorid`, `namechannel`) Values (\""+message.message+"\", (Select id from channels where name = \""+ message.channelTitle +"\"), \""+ message.author +"\", \"" + message.authorId + "\", \"" + message.namechannel + "\")" , { type: sequelize.QueryTypes.INSERT })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Message."
      });
    });
};

exports.findAll = (req, res) => {

  Message.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages."
      });
    });
};

// Retrieve all messages from a channel.
exports.findAllByChannel = (req, res) => {
  const name = req.params.name;
  var condition = name ? { namechannel: { [Op.eq]: `${name}` } } : null;

  Message.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages."
      });
    });
};

// Retrieve all messages from a channel.
exports.find20ByChannel = (req, res) => {
  const name = req.params.name;

  sequelize.query("SELECT message, author FROM (SELECT id, message, author FROM messages WHERE namechannel = \"" + name +"\" ORDER BY id DESC LIMIT 20) messages ORDER BY id ASC")
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving messages."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Message.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Message with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Message.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Message was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update message with id=${id}. Maybe message was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating message with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Message.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Message was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Message with id=${id}. Maybe Message was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Message with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Message.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Messages were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all messages."
      });
    });
};
