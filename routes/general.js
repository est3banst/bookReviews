const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (user) => {
    let usersWithSameName = users.filter((user)=>{
        return users.user === user
      });
      if(usersWithSameName.length > 0){
        return true;
      } else {
        return false;
      }
}

public_users.post("/register", (req,res) => {
  const user = req.body.user;
  const password = req.body.password;

  if (user && password) {
    if (!doesExist(user)) {
        users.push({"username": user, "password": password})
        return res.status(201).json({message: 'User added successfuly'})
      }
      else {
        return res.status(400).json({message: 'User already exists'})
      }
  }
  else {
    return res.status(400).json({message: 'Unable to register user'})
  }
 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbnCode = req.params.isbn;
    return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const formattedAuthor = author.split('+').join(' ').toLowerCase();
  let bookListedByAuthor = [];
  if (formattedAuthor) {
    for (let book in books) {
        if(books[book]["author"].toLowerCase().includes(formattedAuthor)) {
            bookListedByAuthor.push(books[book]);
        }
    }
    return res.status(200).json(bookListedByAuthor);
  }
  return res.status(404).json({message: "No authors were found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const formatedTitle = title.split('+').join(' ').toLowerCase();
  let booksByTitle = [];
  if (formatedTitle) {
    for (let book in books) {
        if (books[book]["title"].toLowerCase().includes(formatedTitle)) {
            booksByTitle.push(books[book]);
        }
    }
    return res.status(200).json(booksByTitle)
  }
  return res.status(404).json({message: "No books were found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    if (isbn) {
        let title = books[isbn]["title"]
        let reviews = JSON.stringify(books[isbn]["reviews"]);
        return res.status(200).json(`The book: ${title} and their reviews: ${reviews}`)
    }
    return res.status(404).json({message: "No books with this code were found"});
});

module.exports.general = public_users;
