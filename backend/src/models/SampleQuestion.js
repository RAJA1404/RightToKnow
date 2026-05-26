const mongoose = require('mongoose');

const sampleQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SampleQuestion', sampleQuestionSchema);
