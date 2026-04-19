import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    const isTokenValid = jwt.verify(token, process.env.SECRET_KEY as string);
    req.secUser = isTokenValid;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, msg: "Unauthorized" });
  }
};
