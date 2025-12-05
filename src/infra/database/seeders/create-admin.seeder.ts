import { User, UserRole } from "@/core/domain/user/entities/User";
import { Email } from "@/core/domain/user/value-objects/Email";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";
import { v4 } from "uuid";

export async function createAdminSeeder() {

    const exists = await UserModel.findOne({ email: "admin@seed.com" });
    if (exists) return;

    const passwordHash = await bcrypt.hash("admin", 10);
    await UserModel.create({
        _id: v4(),
        name: "admin",
        username: "admin",
        email: "admin@seed.com",
        role: "admin",
        active: true,
        password: passwordHash,
    })

    console.log("Admin created");
}