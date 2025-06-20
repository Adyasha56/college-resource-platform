// models/PlacementRecord.js
import mongoose from 'mongoose';

const placementRecordSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  ctc: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    required: true
  },
  description: {
    type: String
  },
  eligibleBranches: {
    type: [String],
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  studentsSelected: [
    {
      name: { type: String, required: true },
      branch: { type: String, required: true },
      year: { type: Number, required: true },
      skills: [{ type: String, required: true }],
      package: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PlacementRecord = mongoose.model('PlacementRecord', placementRecordSchema);
export default PlacementRecord;
