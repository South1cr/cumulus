const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {type: String, required: true},
  units: { type: String, default: 'imperial'}
});

const User = model("User", userSchema);

module.exports = User;