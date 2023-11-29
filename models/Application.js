const mongoose = require("mongoose");


const ApplicationSchema = new mongoose.Schema({
    advertismentId: { type: mongoose.Schema.Types.ObjectId, ref: 'advertisment' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
   programId: { type: mongoose.Schema.Types.ObjectId, ref: 'advertisment.programsOffered' },
    quotaId: {type:String, required: true},
  verification: {type: String, required: true, default: 'Not Verified'},
  createdAt: { type: Date, default: Date.now },
  quotaName: {type:String, required: true},
  collegeName: {type:String, required: true},
  programName: {type:String, required: true},
  formNumber: {type: Number, required: true},
  depositSlip: {type: String, default: ''},
  hafiz_quran: { type: String, required: true },
  reason_hq: {type: String, default: ''},
  admissionStatus: {type: String, default: 'Not Admitted'},
  picture: { type: String, default: '' },
  
});

const Application = mongoose.model("application", ApplicationSchema);

module.exports = Application;
