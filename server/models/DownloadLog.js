// models/DownloadLog.js
import mongoose from 'mongoose';

const downloadLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Will point to the user downloading
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['questionPaper', 'note'], 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DownloadLog = mongoose.model('DownloadLog', downloadLogSchema);
export default DownloadLog;
