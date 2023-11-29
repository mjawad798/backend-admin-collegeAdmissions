const mongoose = require("mongoose");

// testing...
const ProgramsOfferedSchema = new mongoose.Schema({
    programName: {type: String, required: true},
    marksEligibility: {type: Number, required: true},
    genderEligibility: [{type: String, required: true}],
    studyGroupEligibility: [{type: String, required: true}],
    seats: {type: Number, required: true},
    quotaSeats: [{
      name: String
    }]

                     
});
//end testing

const AdvertismentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true},
  description: { type: String, required: true },
  college: {type: String, required: true},
  programsOffered: [ProgramsOfferedSchema] 
});

const Advertisment = mongoose.model("advertisment", AdvertismentSchema);

module.exports = Advertisment;
