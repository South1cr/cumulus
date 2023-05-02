const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const locationSchema = new Schema({
  lat: {type: Number, required: true},
  lon: {type: Number, required: true},
  name: {type: String, required: true},
  state: {type: String, required: true},
  country: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Location = model("Location", locationSchema);

module.exports = Location;