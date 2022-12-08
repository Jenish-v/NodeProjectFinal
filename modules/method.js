const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const process = require("process");
const app = express({ extended: true });
var bodyParser = require("body-parser");
var bcrypt = require("bcrypt");
const tabl = require("table");
const restaurant = require("../models/movie");
const user = require("../models/user");
const { schema } = require("../models/movie");
const { table } = require("console");
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

var Restaurants;
var Users;

async function initialize(url) {
  console.log(url);
  await mongoose.connect(url);
  const database_status = mongoose.connection;
  database_status.on("error", (error) => console.log(error));
  database_status.once("open", () => console.log("Connected to Mongoose"));
  movies = require("../models/movie");
  Users = require("../models/user");
}

async function addUser(username, password) {
  try {
    //console.log('8')
    let result = false;
    let query = { username: username }
    let userSearch = await Users.findOne(query).then(async (data) => {
      if (!data) {
        let saltRounds = 10;
        let passwordSalt = await bcrypt.genSalt(saltRounds, async (err, salt) => {
          let passwordHash = await bcrypt.hash(password, salt, async (err, hash) => {
            let account = { username: username, password: hash, level: 'admin' };
            let newUser = new Users(account);
            let savedUser = await newUser.save()
          });
        });
        result = true;
      } else {
        result = false;
      }
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function validateUser(username, password) {
  try {
    //console.log('9')
    let loginSuccess = false;
    let query = { username: username }
    let userSearch = await Users.findOne(query).then(async (data) => {
      await bcrypt.compare(password, data.password).then((isMatch) => {
        loginSuccess = isMatch;
        return loginSuccess;
      })
      console.log("loginsuccess" + loginSuccess);
    });
    return loginSuccess;
  } catch (error) {
    console.log(error);
  }
}


async function getAllMovies() {
  try {
    //console.log('3')
    let result = await movies.find();
    
    //console.log(table(result));
    return result;
    
  } catch (error) {
    console.log(error);
  }
}

async function getMovieById(id) {
  try {
    //console.log('5')
    let result = await movies.findById(id);
    //console.log(result)
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getMovieByFilter(page, perPage, year) {
  try {
    //console.log('6')
    let result = await movies.find({ year: { $eq: year } })
      .skip(page * perPage)
      .limit(perPage);
    console.log(result)
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function addNewMovie(data) {
  try {
    //console.log('7')
    await movies.create(data);
    let result = await movies.find({ plot: { $eq: data.plot } });
    //console.log(result)
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function updateMovieByID(data, id) {
  try {
    let result = await Restaurants.findByIdAndUpdate(id, data);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function deleteMovieByID(id) {
  try {
    await movies.remove({
      _id: id,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}

module.exports.initialize = initialize;
module.exports.getAllMovies = getAllMovies;
module.exports.getMovieById = getMovieById;
module.exports.getMovieByFilter = getMovieByFilter;
module.exports.addNewMovie = addNewMovie;
module.exports.updateMovieByID = updateMovieByID;
module.exports.deleteMovieByID = deleteMovieByID;
module.exports.addUser = addUser;
module.exports.validateUser = validateUser;
