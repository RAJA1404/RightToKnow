const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'RTIApplication', required: true, index: true },
  action: { 
    type: String, 
    enum: ['STATUS_CHANGE', 'TRANSFER', 'ASSIGNMENT', 'ATTACHMENT_UPLOAD', 'MIGRATION'], 
    required: true,
    index: true
  },
  fromStatus: String,
  toStatus: String,
  remarks: String,
  
  actor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, required: true }
  },
  
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
