const db = require("../models");
const Channel = db.channels;

// Create and Save a new Channel
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a message
    const channel = {
        name: req.body.name,
    };

    // Save message in the database
    Channel.create(channel)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Channel."
            });
        });
};

exports.findAll = (req, res) => {

    Channel.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving channels."
            });
        });
};


// Find a single Channel with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Channel.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Channel with id=" + id
            });
        });
};

// Update a Channel by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Channel.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Channel was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update channel with id=${id}. Maybe channel was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating channel with id=" + id
            });
        });
};

// Delete a Channel with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Channel.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Channel was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Channel with id=${id}. Maybe Channel was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Channel with id=" + id
            });
        });
};

// Delete all Channels from the database.
exports.deleteAll = (req, res) => {
    Channel.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Channels were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all channels."
            });
        });
};