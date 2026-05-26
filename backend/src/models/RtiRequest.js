const mongoose = require('mongoose');

const rtiRequestSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    inputText: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    generatedDraft: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    suggestions: {
      type: [String],
      default: [],
    },
    timeline: {
      type: [
        {
          step: {
            type: String,
            required: true,
            trim: true,
          },
          date: {
            type: Date,
            required: true,
          },
          note: {
            type: String,
            default: '',
            trim: true,
          },
        },
      ],
      default: [],
    },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Processing', 'Completed'],
      default: 'Submitted',
      index: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'rti_requests',
  }
);

module.exports = mongoose.model('RTIRequest', rtiRequestSchema);
