import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import asyncHandler from "./asyncHandler.js";

// Middleware to protect routes
const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export {authenticate};