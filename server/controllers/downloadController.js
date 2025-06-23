import DownloadLog from "../models/DownloadLog.js";

// Get All Downloads (Admin Only)
export const getAllDownloads = async (req, res) => {
  try {
    const downloads = await DownloadLog.find();
    res.json(downloads);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving downloads", error: error.message });
  }
};

// Get Downloads By User
export const getDownloadsByUser = async (req, res) => {
  try {
    const downloads = await DownloadLog.find({ user: req.params.userId });
    res.json(downloads);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving downloads for user", error: error.message });
  }
};

// Log New Download
export const createDownloadLog = async (req, res) => {
  try {
    const { user, resourceId, resourceType } = req.body;

    const newLog = new DownloadLog({ user, resourceId, resourceType });
    await newLog.save();

    res.status(201).json({ message: "Download logged successfully", log: newLog });
  } catch (error) {
    res.status(500).json({ message: "Error creating download log", error: error.message });
  }
};
