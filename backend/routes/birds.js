const express = require("express");

//import user model
const birds = require("../models/birds");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/bird/save", (req, res) => {
  //create variable and instantiate
  let newBird = new birds(req.body);

  //save
  newBird.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "posts saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/birds", (req, res) => {
  birds.find().exec((err, birds) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    // Calculate total quantity
    let totalQuantity = 0;
    birds.forEach((bird) => {
      totalQuantity += parseInt(bird.quantity); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingBirds: birds,
      totalQuantity: totalQuantity,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/bir/edit/update/:id", (req, res) => {
  birds.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, edit) => {
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

router.delete("/bird/delete/:id", (req, res) => {
  birds.findByIdAndDelete(req.params.id).exec((err, deletedBird) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedBird,
    });
  });
});

//get specific post

router.get("/bir/edit/:id", (req, res) => {
  let birdId = req.params.id;
  birds.findById(birdId, (err, bird) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      edit,
    });
  });
});

//export the module

module.exports = router;
