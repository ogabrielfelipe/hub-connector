import mongoose from "mongoose";

export async function up() {
    const collection = mongoose.connection.collection("users");

    await collection.createIndex(
        { active: 1, username: 1 },
        {
            unique: true,
            partialFilterExpression: {
                deletedAt: null
            },
            name: "unique_active_username"
        }
    )
}

export async function down() {
    const collection = mongoose.connection.collection("users");

    await collection.dropIndex("unique_active_username")
}
