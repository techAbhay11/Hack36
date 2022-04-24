const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User schema
const localRouteSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  truckType: {
    type: String,
    required: true,
  },
  costPerKmPerUnitVol: {
    type: String
  },
  totalFreight: {
    type: String
  },
  currentLocation: {
    lat: {
        type: Number
    },
    lon: {
        type: Number
    }
  }
});


const TruckRoute = mongoose.model('TruckRoute', localRouteSchema);

module.exports = TruckRoute;
