import mongoose from "mongoose";

export async function up() {
  const collection = mongoose.connection.collection("routings");

  await collection.createIndex(
    { slug: 1 },
    {
      unique: true,
      partialFilterExpression: {
        deletedAt: null,
      },
      name: "unique_slug",
    },
  );

  await collection.createIndex(
    { gatewayId: 1 },
    {
      name: "index_gatewayId",
    },
  );
}

export async function down() {
  const collection = mongoose.connection.collection("routings");

  await collection.dropIndex("unique_slug");
  await collection.dropIndex("index_gatewayId");
}
