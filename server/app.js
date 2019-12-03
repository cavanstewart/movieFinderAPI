require("dotenv").config();

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const express = require("express");
const morgan = require("morgan");
const axios = require("axios");

const app = express();
let cache = {};

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

app.use(morgan("dev"));

app.get("/", (req, res) => {
  if (!!req.query.i) {
    if (req.query.i in cache) {
      console.log(cache);
      res.send(cache[req.query.i]);
    } else {
      axios({
        url: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${req.query.i}`,
        method: "get"
      })
        .then(response => {
          cache[req.query.i] = response.data;
          res.send(response.data);
        })
        .catch(function(error) {
          console.log("Error " + error.message);
        });
    }
  } else if (!!req.query.t) {
    let t = encodeURIComponent(req.query.t);
    if (t in cache) {
      res.send(cache[t]);
    } else {
      axios({
        url: `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${t}`,
        method: "get"
      })
        .then(response => {
          cache[t] = response.data;
          res.send(response.data);
        })
        .catch(function(error) {
          console.log("Error " + error.message);
        });
    }
  }
});

module.exports = app;
