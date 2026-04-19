import type { Request, Response } from "express";
import Lead from "../models/lead.model.js";

export const leadStats = async (req: Request, res: Response) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  try {
    const [
      totalLeads,
      totalPendingLeads,
      totalResolvedLeads,
      totalLeadSuccess,
      totalLeadFail,
      leadsByCourse,
      leadsBySource,
      recentLeads,
      oldestLeads,
      leadsPerDay,
      leadsToday,
      totalTodayLeads,
    ] = await Promise.all([
      Lead.countDocuments(),

      Lead.countDocuments({ status: "Pending" }),

      Lead.countDocuments({ status: "resolved" }),

      Lead.countDocuments({ leadSuccess: true }),

      Lead.countDocuments({ leadSuccess: false }),

      //  Group by course
      Lead.aggregate([
        {
          $group: {
            _id: "$interestedCourse",
            count: { $sum: 1 },
          },
        },
      ]),

      //  Group by source
      Lead.aggregate([
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 },
          },
        },
      ]),

      // Most recent
      Lead.find().sort({ createdAt: -1 }).limit(5),

      // Oldest
      Lead.find().sort({ createdAt: 1 }).limit(5),

      //   lead per day
      Lead.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // ✅ TODAY LEADS (FULL DATA)
      Lead.find({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),

      // ✅ TODAY LEADS COUNT (for dashboard cards)
      Lead.countDocuments({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        totalPendingLeads,
        totalResolvedLeads,
        totalLeadSuccess,
        totalLeadFail,
        leadsByCourse,
        leadsBySource,
        recentLeads,
        oldestLeads,
        leadsPerDay,
        leadsToday,
        totalTodayLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const leadGroupedByDate = async (req: Request, res: Response) => {
  try {
    const { month, year } : any = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const data = await Lead.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.day": 1 },
      },
    ]);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Unexpected Server error" });
  }
};
