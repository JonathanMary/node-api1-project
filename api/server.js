// BUILD YOUR SERVER HERE
// Imports
const express = require("express");
const User = require("./users/model.js");

// instance of express App
const server = express();
// global middleware
server.use(express.json()); //parse reqs as JSON


// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                   |
server.post("/api/users", (req, res) => {
    const newUser = req.body;
    if ( !newUser.name || !newUser.bio ) {
        res.status(400).json({ message: "Please provide name and bio for the user" });
    } else {
        User.insert(newUser)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" });
            })
    }
})
// | GET    | /api/users     | Returns an array users.                                                                                |
server.get("/api/users", (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" });
        })
})
// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                       |
server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });

            }else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The user information could not be retrieved" });
        })
})
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                 |
server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    User.remove(id)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" });
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user could not be removed" });
        })
})
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    User.update(id, req.body)
        .then(user => {
            console.log("USER: ", user)
            if (!req.body.name || !req.body.bio) {
                res.status(400).json({ message: "Please provide name and bio for the user" })
            } else if (!user) {
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be modified" })
        })
})



// error 404 when wrong request
server.use("*", (req, res) => {
    res.status(404).json({ message: "not found"});
})

//exposing the server to other modules
module.exports = server; // EXPORT YOUR SERVER instead of {}
