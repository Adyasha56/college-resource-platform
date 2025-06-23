import Placement from "../models/PlacementRecord.js";

// Get All Placement Records
export const getAllPlacements = async (req, res) => {
  try {
    const placements = await Placement.find();
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement data", error: error.message });
  }
};

// Get Single Placement by ID
export const getPlacementById = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    if (!placement) {
      return res.status(404).json({ message: "Placement data not found" });
    }
    res.json(placement);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement data", error: error.message });
  }
};

// Create New Placement Record (Admin Only)
export const createPlacement = async (req, res) => {
  try {
    const {
      branch,
      year,
      company,
      ctc,
      selectedStudents,
      rejectedStudents,
      eligibleBranches,
      description,
      createdBy
    } = req.body;

    const newPlacement = new Placement({
      branch,
      year,
      company,
      ctc,
      selectedStudents,
      rejectedStudents,
      eligibleBranches,
      description,
      createdBy
    });

    await newPlacement.save();
    res.status(201).json({ message: "Placement record created successfully", placement: newPlacement });
  } catch (error) {
    res.status(500).json({ message: "Error creating placement record", error: error.message });
  }
};

// Update Placement Record (Admin Only)
export const updatePlacement = async (req, res) => {
  try {
    const updatedData = await Placement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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

// Delete Placement Record (Admin Only)
export const deletePlacement = async (req, res) => {
  try {
    const deleted = await Placement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Placement record not found" });
    }
    res.json({ message: "Placement record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting placement record", error: error.message });
  }
};
