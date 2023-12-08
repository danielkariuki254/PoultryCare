//gonna create models
//Student model

//import mongoose package and assign it to an variable  to connect mongoDB
const mongoose = require("mongoose");

//declare a variable and initialize mongoose schema
const birdSchema = new mongoose.Schema({
  //attibutes
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
});

//export module

//db name                   //db name
const Bird = mongoose.model("birds", birdSchema);
module.exports = Bird;
