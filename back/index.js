const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

const users = [
    {
        id:"1",
        username:"john",
        password: "John0908",
        isAdmin: true,
    },
    {
        id:"2",
        username:"jane",
        password: "Jane0908",
        isAdmin: false,
    },
];

app.post("/api/login", (req, res) => {
    const {username, password} = req.body;
    const user = users.find((u) => {
        return u.username === username && u.password === password;
    });
    if(user){
        // res.json(user)
        const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey");
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken
        })
    }else{
        res.status(400).json("Username or Password Incorrect!")
    }
    // res.json("It Works...");
});

const verify = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, "mySecretKey", (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid!");
        }
  
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You are not authenticated!");
    }
  };

app.delete("/api/users/:userId", verify, (req,res) => {
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("User has been deeted.")
    }else{
        res.status(403).json("You are not allower to delete this user!")
    }
});


app.listen(5000, ()=> console.log("Backend Server Is Running!"));