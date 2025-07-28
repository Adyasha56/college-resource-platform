import PlacementRecord from "../models/PlacementRecord.js";  

// Get All Placement Records
export const getAllPlacements = async (req, res) => {
  try {
    // Removed .populate('uploadedBy') since field is deleted
    const placements = await PlacementRecord.find();
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement data", error: error.message });
  }
};

// Get Single Placement by ID
export const getPlacementById = async (req, res) => {
  try {
    // Removed .populate('uploadedBy') since field is deleted
    const placement = await PlacementRecord.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ message: "Placement data not found" });
    }
    res.json(placement);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement data", error: error.message });
  }
};

// Create Placement Record
export const createPlacement = async (req, res) => {
  try {
    console.log("🔍 RECEIVED PLACEMENT DATA:", req.body);
    
    const {
      company,
      branch,
      year,
      ctc,
      requiredSkills,
      description,
      eligibleBranches,
      studentsSelected
    } = req.body;

    // Check for required fields based on your schema
    if (!company || !branch || !year || !ctc || !eligibleBranches) {
      console.log("❌ MISSING FIELDS");
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["company", "branch", "year", "ctc", "eligibleBranches"]
      });
    }

    const newPlacement = new PlacementRecord({
      company,
      branch,
      year: parseInt(year), // Ensure it's a number
      ctc,
      requiredSkills: requiredSkills || [], // Default to empty array
      description: description || '', // Default to empty string
      eligibleBranches: eligibleBranches || [], // Default to empty array
      studentsSelected: studentsSelected || [] // Default to empty array
      // Removed uploadedBy field completely
    });

    const savedPlacement = await newPlacement.save();
    console.log("✅ PLACEMENT CREATED:", savedPlacement);
    
    res.status(201).json({
      message: "Placement created successfully",
      placement: savedPlacement
    });
  } catch (error) {
    console.error("CREATE PLACEMENT ERROR:", error);
    res.status(500).json({ message: "Error creating placement", error: error.message });
  }
};

// Update Placement Record
export const updatePlacement = async (req, res) => {
  try {
    const { year, ...otherFields } = req.body;
    const updateData = {
      ...otherFields,
      ...(year && { year: parseInt(year) })
    };

    // Removed .populate('uploadedBy') since field is deleted
    const updatedData = await PlacementRecord.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedData) {
      return res.status(404).json({ message: "Placement record not found" });
    }
    res.json({ message: "Updated successfully", placement: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Error updating placement record", error: error.message });
  }
};

// Delete Placement Record
export const deletePlacement = async (req, res) => {
  try {
    const deleted = await PlacementRecord.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Placement record not found" });
    }
    res.json({ message: "Placement record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting placement record", error: error.message });
  }
};