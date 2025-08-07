// controllers/downloadController.js
import DownloadLog from "../models/DownloadLog.js";
import QuestionPaper from "../models/QuestionPaper.js";
import axios from 'axios';

// Get All Downloads (Admin Only)
export const getAllDownloads = async (req, res) => {
  try {
    const downloads = await DownloadLog.find()
      .populate('userId', 'name email year branch')
      .populate({
        path: 'resourceId',
        model: 'QuestionPaper',
        select: 'subject year semester branch examType'
      })
      .sort({ downloadedAt: -1 });

    res.json({
      success: true,
      count: downloads.length,
      data: downloads
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error retrieving downloads", 
      error: error.message 
    });
  }
};

// Get Downloads By User
export const getDownloadsByUser = async (req, res) => {
  try {
    const downloads = await DownloadLog.find({ userId: req.params.userId })
      .populate({
        path: 'resourceId',
        model: 'QuestionPaper',
        select: 'subject year semester branch examType'
      })
      .sort({ downloadedAt: -1 });

    res.json({
      success: true,
      count: downloads.length,
      data: downloads
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error retrieving downloads for user", 
      error: error.message 
    });
  }
};

// Log New Download
export const createDownloadLog = async (req, res) => {
  try {
    const { resourceId, resourceType, fileName, fileSize } = req.body;
    const userId = req.user.id;

    const newLog = new DownloadLog({ 
      userId, 
      resourceId, 
      resourceType,
      fileName: fileName || 'Unknown',
      fileSize: fileSize || 0,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    
    await newLog.save();
    await newLog.populate('userId', 'name email');

    res.status(201).json({ 
      success: true,
      message: "Download logged successfully", 
      data: newLog 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error creating download log", 
      error: error.message 
    });
  }
};

// Download Question Paper File
export const downloadQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the question paper
    const paper = await QuestionPaper.findById(id);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Question paper not found"
      });
    }

    // Log the download
    const downloadLog = new DownloadLog({
      userId: req.user.id,
      resourceId: id,
      resourceType: 'questionPaper',
      fileName: `${paper.subject}_${paper.examType}_Year${paper.year}_Sem${paper.semester}.pdf`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    await downloadLog.save();

    // Get file from Cloudinary and stream it
    try {
      const response = await axios({
        method: 'GET',
        url: paper.fileUrl,
        responseType: 'stream'
      });

      // Set appropriate headers for file download
      const fileName = `${paper.subject}_${paper.examType}_Year${paper.year}_Sem${paper.semester}`;
      const fileExtension = paper.fileUrl.split('.').pop() || 'pdf';
      
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}.${fileExtension}"`);
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      
      // Stream the file
      response.data.pipe(res);
      
    } catch (streamError) {
      console.error('Error streaming file:', streamError);
      return res.status(500).json({
        success: false,
        message: "Error downloading file"
      });
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: "Error processing download",
      error: error.message
    });
  }
};