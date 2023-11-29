const mongoose = require("mongoose");


const SequenceSchema = new mongoose.Schema({
    name: {type:String, required: true, default: 'applicationCounter'},
  seq: {type:Number, required: true, default: 1},
});

const Sequence = mongoose.model("sequence", SequenceSchema);

module.exports = Sequence;
