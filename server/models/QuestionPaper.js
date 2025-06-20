// models/QuestionPaper.js
import mongoose from 'mongoose';

const questionPaperSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    enum: ['modular', 'end semester'], // Type of exam
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  fileUrl: {
    type: String,
    required: true
  }
});

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
export default QuestionPaper;
