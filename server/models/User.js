import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student'],
    default: 'student'
  },
  // Enhanced Profile Fields
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  skills: [skillSchema],
  interestedFields: [{
    type: String,
    enum: [
      'Web Development',
      'AI/ML',
      'Data Science',
      'Mobile Development',
      'DevOps',
      'Cybersecurity',
      'Cloud Computing',
      'Blockchain',
      'Game Development',
      'Embedded Systems',
      'Competitive Programming',
      'UI/UX Design',
      'Other'
    ]
  }],
  customInterests: [{
    type: String,
    trim: true
  }],
  careerGoal: {
    type: String,
    enum: ['Placement', 'Higher Studies', 'Startup', 'Freelancing', 'Research', ''],
    default: ''
  },
  socialLinks: {
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    portfolio: {
      type: String,
      default: ''
    }
  },
  profileCompleted: {
    type: Boolean,
    default: false
  },
  // Recommendation fields
  recommendations: {
    data: {
      type: Object,
      default: null
    },
    generatedAt: {
      type: Date,
      default: null
    },
    expiresAt: {
      type: Date,
      default: null
    },
    provider: {
      type: String,
      enum: ['gemini', 'groq', 'rule-based'],
      default: null
    },
    profileSnapshot: {
      careerGoal: String,
      skills: [String],
      year: Number
    },
    lastManualRefresh: {
      type: Date,
      default: null
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export model using ES module
const User = mongoose.model('User', userSchema);
export default User;
