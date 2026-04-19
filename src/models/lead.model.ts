import mongoose from "mongoose";

interface ILead {
  _id: string;
  name: string;
  contactNo: number;
  email: string;
  interestedCourse: string;
  source : string;
  isIn12: boolean;
  status : string;
  leadSuccess : boolean;
}

const leadSchema = new mongoose.Schema<ILead>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    contactNo: {
      type: Number,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    interestedCourse: {
      type: String,
      enum: ["BCA", "BBA", "BTECH", "MBA", "ITI", "POLYTECHNIC"],
      required: true,
    },
    source : {
      type : String,
      enum : ["facebook" , "instagram" , "wom"]
    },
    isIn12: {
      type: Boolean,
      required: true,
    },
    status : {
      type : String,
      enum : ["Pending" , "resolved"],
      default: "Pending"
    },
    leadSuccess : {
      type : Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const Lead = mongoose.model<ILead>("Lead", leadSchema);

export default Lead;
