const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    if (!username) {
        return false;
    }
    let validUser = users.filter((user) => {
        return user.username === username
    })
    if (validUser.length > 0) {
        return true
    }
    else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let authenticatedPerson = users.filter((user) => {
        return (user.username === username && user.password === password)
    }) 
    if (authenticatedPerson.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const pwd = req.body.password;
  if (!username || !pwd) {
    return res.status(401).json({message: "Unable to login"})
  }
  if (authenticatedUser(username, pwd)) {
    let accessToken = jwt.sign({
        data: pwd
    }, 'access', {expiresIn: 60 * 60})
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: 'User successfuly logged in'});
  }
  else {

  return res.status(208).json({message: "Invalid credentials"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
