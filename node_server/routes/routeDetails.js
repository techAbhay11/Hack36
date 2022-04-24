
const router = require('express').Router();
// Importing Models
let LocalRoute = require('../models/localRoute.model');


// Add Route
router.post("/addroute", async (req, res) => {
  try {
    const { username, truckType, volumeRequired, date, productType, pickupLocation, dropLocation, duration, distance, originName, destinationName } = req.body.routeData;

    console.log(req.body);

    const routed = new LocalRoute({ username: username, truckType: truckType, volumeRequired: volumeRequired, date: date, productType: productType, duration: duration, distance: distance, pickupLocation: pickupLocation, dropLocation: dropLocation, originName: originName, destinationName: destinationName });

    const newRoute = routed.save();

    res.json({request: true});

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
});

// Get All Truck Routes
router.get("/getalltruckroutes", async (req, res) => {
    try {
  
      const allRoutes = await LocalRoute.find({}).exec();

      if(allRoutes.length === 0) {
        return res.status(401).json("No data found");
      }
  
      res.json({routes: allRoutes});
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server error");
    }
  });

  router.post("/getmytruckroutes", async (req, res) => {
    try {

      const { username } = req.body.routeData;
  
      const allRoutes = await LocalRoute.find({username: username}).exec();

      if(allRoutes.length === 0) {
        return res.status(401).json("No data found");
      }
  
      res.json({routes: allRoutes});
  
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server error");
    }
  });




module.exports = router;
