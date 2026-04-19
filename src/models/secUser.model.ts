import mongoose from "mongoose";

interface ISecondaryUser {
  _id: string;
  userName: string;
  password: string;
  role : string;
}

const secondaryUserSchema = new mongoose.Schema<ISecondaryUser>({
  userName: {
    type: String,
    trim: true,
    required: true,
    unique : true
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  role : {
    type : String,
    enum : ["admin","analyst","associate"],
    required : true
  }
});

const SecondaryUser = mongoose.model<ISecondaryUser>("SecondaryUser", secondaryUserSchema);

export default SecondaryUser;
