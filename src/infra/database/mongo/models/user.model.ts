import { Schema, model } from "mongoose";

export interface UserDocument {
    _id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "admin" | "dev";
  password: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      required: true,
      enum: ["admin", "dev", "user"],
      default: "user",
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>("User", UserSchema);