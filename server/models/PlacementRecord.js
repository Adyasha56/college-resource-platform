// models/PlacementRecord.js (FIXED - removed uploadedBy)
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
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  eligibleBranches: {
    type: [String],
    required: true
  },
  // ✅ REMOVED uploadedBy field completely
  studentsSelected: [
    {
      name: { type: String, required: true },
      branch: { type: String, required: true },
      year: { type: Number, required: true },
      skills: [{ type: String }],
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