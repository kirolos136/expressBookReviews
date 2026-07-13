const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let exist = users.filter((user) => user.username === username);
    if(exist.length > 0){
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ 
    let authenticatedUser = users.filter((user)=>{
        return user.username === username && user.password === password;
    })

    if(authenticatedUser > 0){
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message:"error logging in"});
  }

  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
        data:password
    },'access',{expiresIn:60*60});

    req.session.authorization = {
        accessToken,username
    };

    res.status(200).json({message:"user successfully logged in"});
  }else{
    res.status(208).json({message:"invalid login"});
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
