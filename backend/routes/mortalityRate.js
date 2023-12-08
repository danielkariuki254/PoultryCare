const express = require("express");

// Import user model
const Bird = require("../models/birds");
const Mortality = require("../models/mortality");

// Invoke router interface
const router = express.Router();

// Define a route to aggregate and return the total quantities for the current year
router.get("/mortalityRate", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear(); // Get the current year

    // Aggregate the quantity from the Birds collection for the current year
    const birdResult = await Bird.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: null,
          totalBirdQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Aggregate the quantity from the Mortalities collection for the current year
    const mortalityResult = await Mortality.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $group: {
          _id: null,
          totalMortalityQuantity: { $sum: "$quantity" },
        },
      },
    ]);

    // Calculate the total quantities and round them to the nearest whole numbers
    const totalBirdQuantity = birdResult[0]?.totalBirdQuantity || 0;
    const totalMortalityQuantity =
      mortalityResult[0]?.totalMortalityQuantity || 0;

    // Calculate the remainingBirds by subtracting totalMortalityQuantity from totalBirdQuantity
    const remainingBirds = totalBirdQuantity - totalMortalityQuantity;

    // Calculate the mortality rate
    const mortalityRate = Math.round(
      (totalMortalityQuantity / totalBirdQuantity) * 100
    );

    // Return the total quantities, the remainingBirds, and the mortality rate as JSON
    res.json({
      totalBirdQuantity,
      totalMortalityQuantity,
      remainingBirds,
      mortalityRate,
    });
  } catch (error) {
    console.error("Error aggregating data:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
