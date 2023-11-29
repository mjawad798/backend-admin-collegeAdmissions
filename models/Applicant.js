const mongoose = require("mongoose");

// testing...
const QualificationSchema = new mongoose.Schema({
  title: {type: String, required: true},
  studyGroup: {type: String, required: true},
  board: {type: String, required: true},
  session: {type: String, required: true},
  passingYear: {type: String, required: true},
  rollno: {type: String, required: true},
  obtainedMarks: {type: Number, required: true},
  totalMarks: {type: Number, required: true}
                     
});
//end testing

const ApplicantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true},
  name: { type: String, required: true },
  fname: { type: String, required: true },
  email: { type: String, required: true},
  dob: { type: String, required: true },
  cnic: { type: String },
  religion: { type: String, required: true },
  gender: { type: String, required: true },
  landline: { type: String},
  contact1: { type: String, required: true },
  contact2: { type: String, required: true },
  province: { type: String, required: true },
  domicile: { type: String, required: true },
  marital_status: { type: String, required: true },
  hafiz_quran: { type: String, required: true },
  transport_facility: { type: String, required: true },
  hostel_facility: { type: String, required: true },
  income: { type: String, required: true },
  maddress: { type: String, required: true },
  paddress: { type: String, required: true },
  qualification: [QualificationSchema],
  picture: { type: String, default: '' },
  dmc: { type: String, default: ''}
});

const Applicant = mongoose.model("applicant", ApplicantSchema);

module.exports = Applicant;
