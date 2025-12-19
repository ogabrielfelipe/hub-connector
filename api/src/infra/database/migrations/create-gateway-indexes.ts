import mongoose from "mongoose";

export async function up() {
  const collection = mongoose.connection.collection("gateways");

  await collection.createIndex(
    { xApiKey: 1 },
    {
      unique: true,
      partialFilterExpression: {
        deletedAt: null,
      },
      name: "unique_xApiKey",
    },
  );
}

export async function down() {
  const collection = mongoose.connection.collection("gateways");

  await collection.dropIndex("unique_xApiKey");
}
