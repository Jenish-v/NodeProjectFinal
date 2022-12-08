const { strict } = require('assert');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
MovieSchema = new Schema({
    plot : String,
    runtime : Number,
    genres : [{
        a : String,
        b : String,
        c : String
    }],
    cast : [{
        a : String,
        b: String,
        c: String,
        d: String
    }],
    poster : String,
    title : String,
    fullplot : String,
    languages : [{
        a: String
    }],
    released : String,
    directors : [{
        a : String
    }],
    rated : String,
    awards : [{
      wins : Number,
      nomination : Number,
      text : String
    }],
    lastupdated : String,
    year : Number,
    imdb : [{
      rating : Number,
      votes : Number,
      id : Number
    }],
    countries : [{
        a : String,
        b : String
    }],
    type : String,
    tomatoes : [{
      lastUpdated : Date,
      viewer : [{
        rating : Number,
        numreviews : Number,
        meter : Number
      }]
      
    }],
    um_mflix_comments : Number
});
module.exports = mongoose.model('movies', MovieSchema);