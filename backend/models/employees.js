//gonna create models
//Student model

//import mongoose package and assign it to an variable  to connect mongoDB
const mongoose = require("mongoose");

//declare a variable and initialize mongoose schema
const employeeSchema = new mongoose.Schema({
  //attibutes
  worker: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  workerOD: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

//export module

//db name                   //db name
const Employee = mongoose.model("Employees", employeeSchema);
module.exports = Employee;
