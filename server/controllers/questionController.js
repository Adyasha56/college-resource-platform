import QuestionPaper from "../models/QuestionPaper.js";

// Get All Question Papers
export const getAllQuestionPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find();
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error: error.message });
  }
};

// Get Single Question Paper
export const getQuestionPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Question paper not found" });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving question paper", error: error.message });
  }
};

// Create New Question Paper (Admin Only)
export const createQuestionPaper = async (req, res) => {
  try {
    const {
      year,
      semester,
      branch,
      examType,
      subject,
      createdBy,
      fileUrl
    } = req.body;

    const newPaper = new QuestionPaper({
      year,
      semester,
      branch,
      examType,
      subject,
      createdBy,
      fileUrl
    });
    await newPaper.save();
    res.status(201).json({ message: "Question paper added successfully", paper: newPaper });
  } catch (error) {
    res.status(500).json({ message: "Error creating question paper", error: error.message });
  }
};

// Update Question Paper (Admin Only)
export const updateQuestionPaper = async (req, res) => {
  try {
    const updatedData = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedData) {
      return res.status(404).json({ message: "Question paper not found" });
    }
    res.json({ message: "Updated successfully", paper: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Error updating question paper", error: error.message });
  }
};

// Delete Question Paper (Admin Only)
export const deleteQuestionPaper = async (req, res) => {
  try {
    const deleted = await QuestionPaper.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Question paper not found" });
    }
    res.json({ message: "Question paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question paper", error: error.message });
  }
};