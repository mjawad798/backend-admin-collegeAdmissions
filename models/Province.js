const mongoose = require("mongoose");



const ProvinceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domicile: [{
    name: {type: String, required: true}
  }]
});

const Province = mongoose.model("province", ProvinceSchema);

module.exports = Province;
