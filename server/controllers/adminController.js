// controllers/adminController.js
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  // Debugging logs
  console.log("=== LOGIN ADMIN DEBUG ===");
  console.log("req.method:", req.method);
  console.log("req.url:", req.url);
  console.log("req.body:", req.body);
  console.log("req.headers['content-type']:", req.headers['content-type']);
  console.log("typeof req.body:", typeof req.body);


  // Check if body is empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ 
      error: "Request body is empty or undefined",
      receivedBody: req.body 
    });
  }
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

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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

