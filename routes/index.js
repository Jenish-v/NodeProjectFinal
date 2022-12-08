const express = require("express");
const router = express.Router();
var db = require("../modules/method");
var jwtHelper = require("../modules/jwtHelper");
const { verifyAccessToken } = require("../modules/jwtHelper");

router.get("/", (req, res) => {
  res.send("Welcome to the Project by monashah and srikruthi");
  console.log("hello");
});

router.get("/users/login", function (req, res) {
  res.render("login", { title: "Login", error: null });
});

router.get("/users/signup", function (req, res) {
  res.render("signup", { title: "Signup", error: null });
});

router.post("/newUser", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;

  if (username != "" && password != "" && confirmPassword != "") {
    if (confirmPassword == password) {
      let output = await db.addUser(username, password);
      if (output == true) {
        res.render("login", {
          title: "Login",
          error: "Please login with your new account",
        });
      } else {
        res.render("signup", {
          title: "Signup",
          error: "User already Exists!!",
        });
      }
    } else {
      res.render("signup", {
        title: "Signup",
        error: "Passwords dosen't match. Please check the Passwords!!",
      });
    }
  } else {
    res.render("signup", {
      title: "Signup",
      error: "All fields are required. Please check and try again!!",
    });
  }
});

router.post("/validateUser", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (username != "" && password != "") {
    let output = await db.validateUser(username, password);
    if (output == true) {
      const accessToken = await jwtHelper.signAccessToken(username);
      res.send(accessToken);
    } else {
      res.render("login", { title: "Login", error: "Invalid Login" });
    }
  } else {
    res.render("login", {
      title: "Login",
      error: "All fields are required. Please check and try again!!",
    });
  }
});

router.get("/api/movies", async function (req, res) {
  let output = await db.getAllMovies();
  //console.log(output)
  res.send(output);
});

router.get("/api/movies/:movie_id", async function (req, res) {
  let id = req.params.movie_id;
  let output = await db.getMovieById(id);
  //console.log(output)
  res.send(output);
});

router.get("/movies/search", function (req, res) {
  res.render("form");
});

router.post("/movies/search", async (req, res) => {
  let page = req.body.page;
  let perPage = req.body.perPage;
  let year = req.body.year;
  let output = await db.getMovieByFilter(page, perPage, year);
  res.render("formdata", { data: output });
});

router.get(
  "/api/movies/:page/:perPage/:year",
  async function (req, res) {
    let page = req.query.page;
    let perPage = req.query.perPage;
    let year = req.query.year;
    console.log(page);
    console.log("---------");
    console.log(perPage);
    console.log("---------");
    console.log(year);
    let output = await db.getMovieByFilter(page, perPage, year);
    res.send(output);
  }
);

router.post("/api/movies", async function (req, res) {
  //console.log(7);
  var data = {
    plot: req.body.plot,
    runtime: req.body.runtime,
    cast: {
      a : req.body.a,
      b : req.body.b,
      c : req.body.c,
      d : req.body.d
    },

    genres: {
      a: req.body.a,
      b: req.body.b,
      c: req.body.c
    },
    poster: req.body.poster,
    title: req.body.title,
    title: req.body.title,
    fullplot : req.body.fullplot,
    directors: {
      a: req.body.a
    },
    language: {
      a: req.body.a
    },
    released: req.body.released,
    rated: req.body.rated,
    imdb: {
      rating: req.body.rating,
      votes: req.body.votes,
      id: req.body.id
    },
    countries: {
      a: req.body.a,
      b: req.body.b
    },
    type: req.body.type,
    tomatoes: {
      lastUpdated: req.body.lastUpdated,
      viewer: {
      rating: req.body.rating,
      numreviews: req.body.numreviews,
      meter: req.body.meter}
    },
  };
  let output = await db.addNewMovie(data);
  res.send(output);
});

router.put("/api/restaurants/:restaurant_id", async function (req, res) {
  let id = req.params.restaurant_id;
  var data = {
    address: {
      building: req.body.building,
      coord: req.body.coord,
      street: req.body.street,
      zipcode: req.body.zipcode,
    },
    borough: req.body.borough,
    cuisine: req.body.cuisine,
    grades: {
      date: req.body.date,
      grade: req.body.grade,
      score: req.body.score,
    },
    name: req.body.name,
    restaurant_id: req.body.restaurant_id,
  };
  let result = await db.updateMovieByID(data, id);
  console.log(result);
  //res.send(result);
  if (result == true) {
    await res.send("Movie is Updated");
  } else {
    await res.send("Movie is not updated");
  }
});

router.delete("/api/movies/:movie_id", async function (req, res) {
  let id = req.params.movie_id;
  let result = await db.deleteMovieByID(id);
  if (result) {
    res.send("Movie Deleted");
  } else {
    console.log("Movie not deleted");
  }
});
module.exports = router;
