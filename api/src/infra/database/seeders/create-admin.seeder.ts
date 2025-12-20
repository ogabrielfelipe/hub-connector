import bcrypt from "bcrypt";
import { UserModel } from "../models/userModel";
import { v4 } from "uuid";

export async function createAdminSeeder() {
  const exists = await UserModel.findOne({ email: "admin@seed.com" });
  if (exists) return;

  await UserModel.create({
    _id: v4(),
    name: "admin",
    username: "admin",
    email: "admin@seed.com",
    role: "admin",
    active: true,
    password: bcrypt.hashSync("admin@2123", 10),
  });

  console.log("Admin created");
}
