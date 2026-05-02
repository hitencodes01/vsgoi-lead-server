import { Request, Response } from "express";
import Lead from "../models/lead.model.js";
import { io } from "../index.js";
import SecondaryUser from "../models/secUser.model.js";
import Notification from "../models/notification.model.js";

export const postLead = async (req: Request, res: Response) => {
  try {
    const { name, email, contactNo, interestedCourse, source, isIn12 } =
      req.body;
    const isPrimaryUserExist = await Lead.findOne({ contactNo });
    if (isPrimaryUserExist) {
      if (
        name === isPrimaryUserExist.name &&
        interestedCourse === isPrimaryUserExist?.interestedCourse
      ) {
        return res.status(409).json({
          message: "User already exists with same course",
        });
      }
    }

    const lead = await Lead.create({
      name,
      email,
      contactNo,
      interestedCourse,
      source,
      isIn12,
    });

    const users = await SecondaryUser.find({});
    const notification = users.map((user) => ({
      userId: user._id,
      message: "New Lead Generated",
    }));
    await Notification.insertMany(notification);

    // Real-time emit (per user)
    users.forEach((user) => {
      io.to(user._id.toString()).emit("new-lead", {
        message: "New Lead Generated",
        name: lead.name,
        interestedCourse: lead.interestedCourse,
      });
    });

    return res
      .status(201)
      .json({ success: true, message: "Query successfully registred" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Unexpexted server error" });
  }
};

export const getAllLead = async (req: Request, res: Response) => {
  try {
    const leads = await Lead.find({});

    return res.status(200).json({ leads });
  } catch (error) {
    return res.status(500).json({ message: "Unexpected Server Error" });
  }
};

export const getTodayLeads = async (req: Request, res: Response) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const leads = await Lead.find({
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("getTodayLeads error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateLead = async (req: Request, res: Response) => {
  try {
    const { status, leadSuccess } = req.body;
    const {id} = req.params;
    const lead = await Lead.findById({ _id : id });
    if (!lead)
      return res.status(404).json({ success: false, msg: "Lead not found" });
    await Lead.findByIdAndUpdate(
      { _id : id },
      { status: status, leadSuccess: leadSuccess },
    );
    res.status(200).json({ success: true, msg: "Lead updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
