const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const locationSchema = new Schema({
  lat: Number,
  lon: Number,
  name: String,
  state: String,
  country: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

const Location = model("Location", locationSchema);

module.exports = Location;