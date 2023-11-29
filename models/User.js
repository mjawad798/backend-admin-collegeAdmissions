const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lockProfile: {
    type: Boolean,
    default: false
  },
  step1:{
    type: Boolean,
    default: true
  },
  step2:{
    type: Boolean,
    default: false
  },
  step3:{
    type: Boolean,
    default: false
  },
  step4:{
    type: Boolean,
    default: false
  }

});
const User = mongoose.model("user", UserSchema);
module.exports = User;
