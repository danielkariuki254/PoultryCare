const express = require("express");

//import user model
const purchases = require("../models/purchases");

//invoke router interface
const router = express.Router();

//CRUD
//CREATE-----------------------------Use post http request----------------------------------------------------------------------------------------------

router.post("/purchase/save", (req, res) => {
  //create variable and instantiate
  let newPurchase = new purchases(req.body);

  //save
  newPurchase.save((err) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    return res.status(200).json({
      success: "purchases saved successfully",
    });
  });
});

//READ-----------------------------Use get http request----------------------------------------------------------------------------------------------

// purchases router
// router.get("/purchases", (req, res) => {
//   purchases.find().exec((err, purchases) => {
//     if (err) {
//       return res.status(400).json({
//         error: err,
//       });
//     }

//     let totalPurchasesQuantity = 0;
//     purchases.forEach((purchase) => {
//       totalPurchasesQuantity += parseInt(purchase.quantity); // Parse quantity as integer
//     });

//     // Store the total sales in the database
//     // Assuming you have a SalesTotal model/schema in your database
//     PurchasesTotal.findOneAndUpdate(
//       {}, // Assuming there's only one document storing the total sales
//       { $set: { totalPurchasesQuantity: totalPurchasesQuantity } },
//       { upsert: true }
//     )
//       .then(() => {
//         return res.status(200).json({
//           success: true,
//           existingPurchases: purchases,
//           totalPurchasesQuantity: totalPurchasesQuantity,
//         });
//       })
//       .catch((error) => {
//         return res.status(400).json({
//           error: error,
//         });
//       });
//   });
// });

router.get("/purchases", (req, res) => {
  purchases.find().exec((err, purchases) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }

    let totalPurchasesQuantity = 0;
    purchases.forEach((purchase) => {
      totalPurchasesQuantity += parseInt(purchase.amount); // Parse quantity as integer
    });

    return res.status(200).json({
      success: true,
      existingPurchases: purchases,
      totalPurchasesQuantity: totalPurchasesQuantity,
    });
  });
});
//DELETE-----------------------------Use delete http request----------------------------------------------------------------------------

router.delete("/purchase/delete/:id", (req, res) => {
  purchases.findByIdAndDelete(req.params.id).exec((err, deletedPurchase) => {
    if (err)
      return res.status(400).json({
        message: "Deleted unsuccussfull",
        err,
      });

    return res.json({
      message: "Deleted succussfully",
      deletedPurchase,
    });
  });
});

//get specific post

router.get("/purchase/:id", (req, res) => {
  let purchaseId = req.params.id;
  purchases.findById(purchaseId, (err, purchase) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      purchase,
    });
  });
});

//export the module

module.exports = router;
