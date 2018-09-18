const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const db = require("./db/helpers");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get("/", (req, res) => {
  res.send("You made it!");
});

server.post("/api/register", (req, res) => {
  const creds = req.body;

  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db.hashUser(creds)
    .then(id => res.status(201).send("Successful"))
    .catch(err => res.status(500).send("error creating user"));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;

  db.verifyUser(creds)
  
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(201).send("Successful");
      } else {
        return res.status(401).json({ error: "Incorrect credentials" });
      }
    })
    .catch(err => res.status(500).send("There was an issue with the server"));
});

const port = 9000;
server.listen(
  port,
  console.log(`\n ===> Server is running on port:${port} <=== \n`)
);
