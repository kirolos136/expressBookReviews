const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: `user ${username} added successfully` });
    }else{
        return res.status(404).json({ message: "user already exists." });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
  }
  return res.status(404).json({ message: "unable to register the user" });
});

// Task 6: Get the book list — using Promises (.then)
public_users.get('/', function (req, res) {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  };

  getBooks()
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(500).json({ message: "error fetching books" });
    });
});

// Task 7: Get book details based on ISBN — using Promises (.then/.catch)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("book doesn't exist");
      }
    });
  };

  getBookByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Task 8: Get book details based on author — using async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const authorBooks = Object.values(books).filter((book) => book.author === author);
      if (authorBooks.length > 0) {
        resolve(authorBooks);
      } else {
        reject("no books found for this author");
      }
    });
  };

  try {
    const result = await getBooksByAuthor(author);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 9: Get all books based on title — using async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      const titleBooks = Object.values(books).filter((book) => book.title === title);
      if (titleBooks.length > 0) {
        resolve(titleBooks);
      } else {
        reject("no books found with this title");
      }
    });
  };

  try {
    const result = await getBooksByTitle(title);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review (unchanged — no async needed here per lab tasks)
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "book doesn't exist" });
});

module.exports.general = public_users;