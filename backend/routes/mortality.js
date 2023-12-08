const express = require("express");

//import user model
const mortality = require("../models/mortality");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/mortalit/save", (req, res) => {
  //create variable and instantiate
  let newMortalit = new mortality(req.body);

  //save
  newMortalit.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "mortality saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/mortality", (req, res) => {
  mortality.find().exec((err, mortality) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    // Calculate total quantity
    let totalMortalityQuantity = 0;
    mortality.forEach((mortalit) => {
      totalMortalityQuantity += parseInt(mortalit.quantity); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingMortality: mortality,
      totalMortalityQuantity: totalMortalityQuantity,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/mortalit/update/:id", (req, res) => {
  mortality.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, mortalit) => {
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

router.delete("/mortalit/delete/:id", (req, res) => {
  mortality.findByIdAndDelete(req.params.id).exec((err, deletedMortalit) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedMortalit,
    });
  });
});

//get specific post

router.get("/mortalit/:id", (req, res) => {
  let mortalitId = req.params.id;
  mortality.findById(mortalitId, (err, mortalit) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      mortalit,
    });
  });
});

//export the module

module.exports = router;
