export const isAdmin = (req, res, next) => {
  console.log("USER OBJECT:", req.user); // Debug log
  console.log("USER ROLE:", req.user?.role); // Debug log
  
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "admin") {
    console.log("ROLE CHECK FAILED - Expected: admin, Got:", req.user.role);
    return res.status(403).json({ message: "Access denied, Admin only" });
  }

  console.log("ADMIN CHECK PASSED");
  next();
};