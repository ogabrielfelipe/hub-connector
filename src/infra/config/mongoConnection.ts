import mongoose from "mongoose";
import { env } from "./env";

export async function connectMongo(uri?: string) {
  if (mongoose.connection.readyState !== 0) return;

  const mongoUri = uri || env.MONGO_URI;

  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB with Mongoose!");
}

export async function disconnectMongo() {
  if (mongoose.connection.readyState === 0) return;

  await mongoose.disconnect();

  console.log("Disconnected from MongoDB!");
}
