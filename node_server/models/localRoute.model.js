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
  },
  productType: {
    type: String,
  },
  volumeRequired: {
    type: String
  },
  date: {
    type: String
  },
  duration: {
    type: String
  },
  distance: {
    type: String
  },
  pickupLocation: {
      lat: {
          type: Number
      },
      lon: {
          type: Number
      }
  },
  dropLocation: {
    lat: {
        type: Number
    },
    lon: {
        type: Number
    }
  },
  originName: {
    type: String
  },
  destinationName: {
    type: String
  }
});


const LocalRoute = mongoose.model('LocalRoute', localRouteSchema);

module.exports = LocalRoute;
