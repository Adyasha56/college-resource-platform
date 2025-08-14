// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware to protect routes (authenticated users only) - FOR ALL USERS
export const protect = async (req, res, next) => {
  try {
    console.log("AUTH MIDDLEWARE - Headers:", req.headers);
    
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No authorization header or wrong format");
      return res.status(401).json({ 
        success: false,
        message: "No token found, access denied" 
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("EXTRACTED TOKEN:", token?.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);
    
    req.user = decoded;
    console.log("AUTH SUCCESS - User set:", req.user);
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Auth server error: " + error.message 
    });
  }
};

// Middleware ONLY for admin routes
export const protectAdmin = async (req, res, next) => {
  try {
    console.log("ADMIN AUTH MIDDLEWARE - Headers:", req.headers);
    
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No authorization header or wrong format");
      return res.status(401).json({ 
        success: false,
        message: "No token found, access denied" 
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("EXTRACTED TOKEN:", token?.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);
    
    // Check if user has admin role
    if (decoded.role !== 'admin') {
      console.log("Not admin role:", decoded.role);
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }

    req.user = decoded;
    console.log("ADMIN AUTH SUCCESS - User set:", req.user);
    next();
  } catch (error) {
    console.error("ADMIN AUTH ERROR:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Auth server error: " + error.message 
    });
  }
};