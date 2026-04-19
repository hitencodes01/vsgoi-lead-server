import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import SecondaryUser from "../models/secUser.model.js";

export async function secUserLogin(req: Request, res: Response) {
  try {
    const { userName, password, role } = req.body;
    const isUser = await SecondaryUser.findOne({ userName, role });
    if (!isUser) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username" });
    }
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    const payload = {
      _id: isUser._id,
      role: isUser.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "7d",
      issuer: "lead-vsgoi",
    });
    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({ success: true, message: "Login successfull", user: payload });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Unexpected server error", });

  }
}
