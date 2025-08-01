import QuestionPaper from "../models/QuestionPaper.js";
import cloudinary from "../config/cloudinary.js";

// Get All Question Papers
export const getAllQuestionPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find()
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 }); // Latest first
    
    res.json({
      success: true,
      count: papers.length,
      data: papers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error retrieving questions", 
      error: error.message 
    });
  }
};

// Get Single Question Paper
export const getQuestionPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!paper) {
      return res.status(404).json({ 
        success: false,
        message: "Question paper not found" 
      });
    }
    
    res.json({
      success: true,
      data: paper
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error retrieving question paper", 
      error: error.message 
    });
  }
};

// Create New Question Paper (Admin Only)
export const createQuestionPaper = async (req, res) => {
  try {
    console.log("📄 CREATE QUESTION PAPER REQUEST");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    console.log("User:", req.user);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a question paper file"
      });
    }

    const {
      year,
      semester,
      branch,
      examType,
      subject
    } = req.body;

    // Validate required fields
    if (!year || !semester || !branch || !examType || !subject) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newPaper = new QuestionPaper({
      year: parseInt(year),
      semester: parseInt(semester),
      branch,
      examType,
      subject,
      uploadedBy: req.user.id, // From JWT token
      fileUrl: req.file.path, // Cloudinary URL
    });

    await newPaper.save();
    
    // Populate the uploadedBy field for response
    await newPaper.populate('uploadedBy', 'name email');

    console.log("✅ Question paper created:", newPaper);

    res.status(201).json({ 
      success: true,
      message: "Question paper uploaded successfully", 
      data: newPaper 
    });
  } catch (error) {
    console.error("❌ Error creating question paper:", error);
    
    // If there was an error but file was uploaded, delete from cloudinary
    if (req.file && req.file.public_id) {
      try {
        await cloudinary.uploader.destroy(req.file.public_id, { resource_type: 'raw' });
      } catch (deleteError) {
        console.error("Error deleting file from cloudinary:", deleteError);
      }
    }

    res.status(500).json({ 
      success: false,
      message: "Error creating question paper", 
      error: error.message 
    });
  }
};

// Update Question Paper (Admin Only)
export const updateQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find existing paper
    const existingPaper = await QuestionPaper.findById(id);
    if (!existingPaper) {
      return res.status(404).json({ 
        success: false,
        message: "Question paper not found" 
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // If new file is uploaded, update fileUrl
    if (req.file) {
      updateData.fileUrl = req.file.path;
      
      // Delete old file from cloudinary (optional)
      try {
        const publicId = existingPaper.fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      } catch (deleteError) {
        console.error("Error deleting old file:", deleteError);
      }
    }

    const updatedPaper = await QuestionPaper.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'name email');

    res.json({ 
      success: true,
      message: "Updated successfully", 
      data: updatedPaper 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error updating question paper", 
      error: error.message 
    });
  }
};

// Delete Question Paper (Admin Only)
export const deleteQuestionPaper = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    
    if (!paper) {
      return res.status(404).json({ 
        success: false,
        message: "Question paper not found" 
      });
    }

    // Delete file from Cloudinary
    try {
      const publicId = paper.fileUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      console.log("🗑️ File deleted from Cloudinary");
    } catch (deleteError) {
      console.error("Error deleting file from cloudinary:", deleteError);
    }

    // Delete from database
    await QuestionPaper.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: "Question paper deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error deleting question paper", 
      error: error.message 
    });
  }
};

// Get Question Papers with Filters
export const getFilteredQuestionPapers = async (req, res) => {
  try {
    const { year, semester, branch, examType, subject } = req.query;
    
    // Build filter object
    let filter = {};
    if (year) filter.year = parseInt(year);
    if (semester) filter.semester = parseInt(semester);
    if (branch) filter.branch = new RegExp(branch, 'i'); // Case insensitive
    if (examType) filter.examType = examType;
    if (subject) filter.subject = new RegExp(subject, 'i'); // Case insensitive

    const papers = await QuestionPaper.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: papers.length,
      data: papers,
      filters: { year, semester, branch, examType, subject }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering question papers",
      error: error.message
    });
  }
};