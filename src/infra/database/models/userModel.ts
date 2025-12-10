import { Schema, model } from "mongoose";

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  username: string;
  role: "user" | "admin" | "dev";
  active: boolean;
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
    active: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

UserSchema.index({ active: 1, username: 1 });

export const UserModel = model<UserDocument>("User", UserSchema);
