//gonna create models
//Student model

//import mongoose package and assign it to an variable  to connect mongoDB
const mongoose = require("mongoose");

//declare a variable and initialize mongoose schema
const mortalitSchema = new mongoose.Schema({
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
const Mortalit = mongoose.model("mortalities", mortalitSchema);
module.exports = Mortalit;
