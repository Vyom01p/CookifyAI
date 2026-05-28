import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    //Get Token from Header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No Authentication Access Denied",
      });
    }
    //Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
export default authMiddleware;
