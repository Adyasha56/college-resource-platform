// server/controllers/profileController.js
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, skills, interestedFields, customInterests, careerGoal, year, branch, socialLinks } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (skills) updateData.skills = skills;
    if (interestedFields) updateData.interestedFields = interestedFields;
    if (customInterests) updateData.customInterests = customInterests;
    if (careerGoal !== undefined) updateData.careerGoal = careerGoal;
    if (year) updateData.year = year;
    if (branch) updateData.branch = branch;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // Check if profile is complete
    const user = await User.findById(req.user.id);
    const hasBasicInfo = name || user.name;
    const hasBio = bio || user.bio;
    const hasSkills = (skills && skills.length > 0) || (user.skills && user.skills.length > 0);
    const hasInterests = (interestedFields && interestedFields.length > 0) || (user.interestedFields && user.interestedFields.length > 0);
    
    updateData.profileCompleted = !!(hasBasicInfo && hasBio && hasSkills && hasInterests);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'college-platform/avatars',
          transformation: [
            { width: 200, height: 200, crop: 'fill', gravity: 'face' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user avatar
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({ 
      message: 'Avatar uploaded successfully', 
      avatar: result.secure_url,
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading avatar', error: err.message });
  }
};

// Get skill suggestions
export const getSkillSuggestions = async (req, res) => {
  const skills = [
    // Programming Languages
    "JavaScript", "Python", "Java", "C++", "C", "TypeScript", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R",
    
    // Frontend
    "React", "Vue.js", "Angular", "Next.js", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "SASS", "Material UI", "Redux", "Svelte",
    
    // Backend
    "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "FastAPI", "Ruby on Rails", "ASP.NET", "GraphQL", "REST API",
    
    // Database
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "SQLite", "Oracle", "Cassandra", "DynamoDB",
    
    // DevOps & Cloud
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Linux", "Nginx", "Jenkins", "Terraform", "Ansible",
    
    // AI/ML
    "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Scikit-learn", "Pandas", "NumPy", "OpenCV",
    
    // Mobile
    "React Native", "Flutter", "Android Development", "iOS Development", "Expo",
    
    // Tools & Others
    "Git", "GitHub", "VS Code", "Postman", "Figma", "Jira", "Agile", "Scrum",
    
    // CS Fundamentals
    "Data Structures", "Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks", "System Design", "Design Patterns"
  ];

  const { search } = req.query;
  
  if (search) {
    const filtered = skills.filter(skill => 
      skill.toLowerCase().includes(search.toLowerCase())
    );
    return res.status(200).json({ skills: filtered });
  }

  res.status(200).json({ skills });
};

// Get interest field options
export const getInterestFields = async (req, res) => {
  const fields = [
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
    'UI/UX Design'
  ];

  res.status(200).json({ fields });
};
