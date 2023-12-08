const express = require("express");

//import user model
const employees = require("../models/employees");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/employee/save", (req, res) => {
  //create variable and instantiate
  let newEmployee = new employees(req.body);

  //save
  newEmployee.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "employees saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/employees", (req, res) => {
  employees.find().exec((err, employees) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      existingEmployees: employees,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/employee/update/:id", (req, res) => {
  employees.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, employee) => {
      if (err) {
        return res.status(400).json({
          error: "can not update",
        });
      }
      return res.status(200).json({
        success: "Updated Successfully",
      });
    }
  );
});

//DELETE-----------------------------Use delete http request----------------------------------------------------------------------------

router.delete("/employee/delete/:id", (req, res) => {
  employees.findByIdAndDelete(req.params.id).exec((err, deletedEmployee) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedEmployee,
    });
  });
});

//get specific post

router.get("/employee/:id", (req, res) => {
  let employeeId = req.params.id;
  employees.findById(employeeId, (err, employee) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  });
});

//export the module

module.exports = router;
