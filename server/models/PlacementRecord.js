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
  // Stats for placement drive
  studentsApplied: {
    type: Number,
    default: 0
  },
  studentsPlaced: {
    type: Number,
    default: 0
  },
  // Interview questions asked (like Glassdoor)
  interviewQuestions: [
    {
      question: { type: String, required: true },
      round: { 
        type: String, 
        enum: ['Aptitude', 'Technical', 'HR', 'Coding', 'Group Discussion', 'Other'],
        default: 'Technical'
      },
      category: { 
        type: String,
        enum: ['DSA', 'DBMS', 'OS', 'CN', 'OOPs', 'Web Dev', 'System Design', 'Behavioral', 'Puzzle', 'General', 'Other'],
        default: 'General'
      },
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
      }
    }
  ],
  
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