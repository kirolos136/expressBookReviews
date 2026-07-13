const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message:"user added successfully"});
    }
  }else{
    return res.status(404).json({message:"user already exists"});
  }
  return res.status(404).json({message:"unable to register the user"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let bookFound = books[isbn];
  
    if (bookFound) {
      return res.status(200).json(bookFound);
    }
    return res.status(404).json({message: "book doesn't exist"});
  });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let authorBook = Object.values(books).filter((book)=>book.author === author);
  if (authorBook) {
    return res.status(200).json(authorBook);
  }
  return res.status(404).json({message: "book doesn't exist"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let titleFound = Object.values(books).filter((book)=>book.title === title);
  if(titleFound){
    return res.status(200).json(titleFound);
  }
  return res.status(404).json({message: "book doesn't exist"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if(book){
        return res.status(200).json(book.reviews);
    }
    return res.status(404).json({message:"book doesn't exist"});
});

module.exports.general = public_users;
