const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subjects: {
    type: String,
   required:true,
  },
});

const QualificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  studyGroup: [studyGroupSchema],
});

const Qualification = mongoose.model('lookUpQualification',QualificationSchema);

module.exports = Qualification;
