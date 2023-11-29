const mongoose = require('mongoose');

const quotaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const Quota = mongoose.model('lookUpQuota', quotaSchema);

module.exports = Quota;
