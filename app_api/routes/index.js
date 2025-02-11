const express = require('express'); // Express app
const router = express.Router(); // Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

// Define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList) // GET method routes triplist
    .post(tripsController.tripsAddTrip); // POST Method Adds a Trip

// GET method routes tripsFindByCode 
// PUT method routes tripsUpdateTrip
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode) // GET method routes triplist
    .put(tripsController.tripsUpdateTrip);
    
module.exports = router;