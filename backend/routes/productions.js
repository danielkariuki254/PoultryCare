const express = require("express");

//import user model
const productions = require("../models/productions");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/production/save", (req, res) => {
  //create variable and instantiate
  let newProduction = new productions(req.body);

  //save
  newProduction.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "production saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/productions", (req, res) => {
  productions.find().exec((err, productions) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    // Calculate total quantity
    let totalProductionsQuantity = 0;
    productions.forEach((production) => {
      totalProductionsQuantity += parseInt(production.quantity); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingProductions: productions,
      totalProductionsQuantity: totalProductionsQuantity,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/production/update/:id", (req, res) => {
  productions.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, production) => {
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

router.delete("/production/delete/:id", (req, res) => {
  productions
    .findByIdAndDelete(req.params.id)
    .exec((err, deletedProduction) => {
      if (err)
        return res.status(400).json({
          message: "Deleted unsuccussfull",
          err,
        });

      return res.json({
        message: "Deleted succussfully",
        deletedProduction,
      });
    });
});

//get specific post

router.get("/production/:id", (req, res) => {
  let productionId = req.params.id;
  productions.findById(productionId, (err, production) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      production,
    });
  });
});

//export the module

module.exports = router;
