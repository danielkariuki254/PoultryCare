//gonna create models
//Student model

//import mongoose package and assign it to an variable  to connect mongoDB
const mongoose = require("mongoose");

//declare a variable and initialize mongoose schema
const purchaseSchema = new mongoose.Schema({
  //attibutes
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  quantity: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
});

//export module

//db name                   //db name
const Purchase = mongoose.model("Purchases", purchaseSchema);
module.exports = Purchase;
