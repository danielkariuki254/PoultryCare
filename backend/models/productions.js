//gonna create models
//Student model

//import mongoose package and assign it to an variable  to connect mongoDB
const mongoose = require("mongoose");

//declare a variable and initialize mongoose schema
const productionSchema = new mongoose.Schema({
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
const Production = mongoose.model("Production", productionSchema);
module.exports = Production;
