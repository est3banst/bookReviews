const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

const doesExist = (usern) => {
    let usersWithSameName = users.filter((user)=>{
        return user.username === usern
      });
      if(usersWithSameName.length > 0){
        return true;
      } else {
        return false;
      }
}



public_users.post("/register", (req,res) => {
  const user = req.body.username;
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
//Getting books asynchronously with async await
public_users.get('/', async function (req, res) {
  return await res.status(200).json(JSON.stringify(books));
});

function searchBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error('Book not found'));
      }
    });
  }
// Get book details based on ISBN
// Getting books asynchronously with Promises
public_users.get('/isbn/:isbn',function (req, res) {
    const isbnCode = req.params.isbn;
    searchBookByISBN(isbnCode)
    .then((bookMatching) => {
        return res.status(200).json(bookMatching);
    })
    .catch((err) => {
    return res.status(200).json({message: 'No books were found'})
});
});

function searchByAuthor(author) {
    return new Promise((resolve, reject) => {
        const booksByAuthor = [];
        for (let book in books) {
          if (books.hasOwnProperty(book) && books[book].author.toLowerCase() == author) {
         booksByAuthor.push(books[book]);
          }
        }
    
        if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error('No books were found for the given author'));
        }
      });
    }
  
// Get book details based on author
// Gett books by author with promises
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const formattedAuthor = author.split('+').join(' ').toLowerCase();
  
  searchByAuthor(formattedAuthor) 
    .then((booksByAuthor) => {
        return res.status(200).json(booksByAuthor);
    })
    .catch((err) => {
        return res.status(404).json({message: "No authors were found"});
    })
});
function searchByTitle (title) {
    return new Promise((resolve, reject) => {
        const booksByTitle = [];
        for (book in books) {
            if (books.hasOwnProperty(book) && books[book]["title"].toLowerCase == title) {
                booksByTitle.push(books[book])
            }
        }
        if (booksByTitle.length > 0) {
        resolve(booksByTitle) }
        else {
            reject(new Error("No books were found with this title"))
        }
    })
}

// Get all books based on title
// Gett all books by title with promises
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const formatedTitle = title.split('+').join(' ').toLowerCase();
    searchByTitle(formatedTitle)
    .then((booksByTitle) => {
      return res.status(200).json(booksByTitle)
    })
    .catch((err) => { return res.status(404).json({message: "No books were found with this title"});
  })
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
