
import mongoose from "mongoose";
import { env } from "./env";

export async function connectMongo() {
  if (mongoose.connection.readyState !== 0) return;

  await mongoose.connect(env.MONGO_URI);

  console.log("Connected to MongoDB with Mongoose!");
}

export async function disconnectMongo() {
  if (mongoose.connection.readyState === 0) return; 

  await mongoose.disconnect();

  console.log("Disconnected from MongoDB!");
}
