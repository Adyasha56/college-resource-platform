const adminMiddleware = (req, res, next) => {
  // User must be logged in first
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Check if role is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, Admin only" });
  }

  next();
};

export default adminMiddleware;
