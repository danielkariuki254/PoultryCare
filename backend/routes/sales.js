const express = require("express");

//import user model
const sales = require("../models/sales");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/sale/save", (req, res) => {
  //create variable and instantiate
  let newSale = new sales(req.body);

  //save
  newSale.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "sales saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

router.get("/sales", (req, res) => {
  sales.find().exec((err, sales) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: true,
      existingSales: sales,
    });
  });
});

//UPDATE-----------------------------Use put http request------------------------------------------------------------------------------

router.put("/sale/update/:id", (req, res) => {
  sales.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, sale) => {
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

router.delete("/sale/delete/:id", (req, res) => {
  sales.findByIdAndDelete(req.params.id).exec((err, deletedSale) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedSale,
    });
  });
});

//get specific post

router.get("/sale/:id", (req, res) => {
  let saleId = req.params.id;
  sales.findById(saleId, (err, sale) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      sale,
    });
  });
});

//export the module

module.exports = router;
