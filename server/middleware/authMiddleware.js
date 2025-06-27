import jwt from "jsonwebtoken";

// Middleware to protect routes (authenticated users only)
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token found, access denied" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// This middleware checks for a valid JWT token in the Authorization header.
// If the token is valid, it decodes the user information and attaches it to the request object.
// If the token is missing or invalid, it responds with a 401 Unauthorized status and an