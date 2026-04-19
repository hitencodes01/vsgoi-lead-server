import { Request, Response, Router } from "express";
import { protect } from "../middlewares/roleProtect.js";
import Notification from "../models/notification.model.js";

const router = Router();

router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({
      userId: req.secUser._id,
      isRead: false,
    }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.patch("/read", protect , async (req : Request, res : Response) => {
  try {
    await Notification.updateMany(
      { userId: req.secUser._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
})

export default router;
