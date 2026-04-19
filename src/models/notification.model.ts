import mongoose from "mongoose";

interface INotification {
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new mongoose.Schema<INotification>({
  userId: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default Notification;
