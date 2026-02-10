// controllers/adminController.js
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //FIXED - Include role in token
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: "admin"  //added due to 403 forbidden err
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    console.error("Admin creation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const QuestionPaper = (await import("../models/QuestionPaper.js")).default;
    const PlacementRecord = (await import("../models/PlacementRecord.js")).default;

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total uploaded papers
    const uploadedPapers = await QuestionPaper.countDocuments();

    // Get total placements posted
    const placementsPosted = await PlacementRecord.countDocuments();

    // Get students distribution by year
    const studentsByYear = await User.aggregate([
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Get placement statistics by company with average package
    const placementStats = await PlacementRecord.aggregate([
      {
        $group: {
          _id: "$branch",
          totalPlacements: { $sum: 1 },
          avgPackage: { $avg: { $toDouble: "$package" } },
          companies: { $addToSet: "$company" }
        }
      },
      {
        $sort: { totalPlacements: -1 }
      }
    ]);

    // Get recent papers uploaded (last 5)
    const recentPapers = await QuestionPaper.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("uploadedBy", "name")
      .select("subject branch examType year semester uploadedBy createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        uploadedPapers,
        placementsPosted,
        studentsByYear,
        placementStats,
        recentPapers
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching dashboard statistics" 
    });
  }
};

