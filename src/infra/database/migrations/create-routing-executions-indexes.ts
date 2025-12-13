import mongoose from "mongoose";

export async function up() {
    const collection = mongoose.connection.collection("routing_executions");

    await collection.createIndex(
        { routingId: 1 },
        {
            name: "routing_executions_routingId"
        }
    )

    await collection.createIndex(
        { status: 1 },
        {
            name: "routing_executions_status"
        }
    )

    await collection.createIndex(
        { finishedAt: 1 },
        {
            name: "routing_executions_finishedAt"
        }
    )
}

export async function down() {
    const collection = mongoose.connection.collection("routing_executions");

    await collection.dropIndex("routing_executions_routingId")
    await collection.dropIndex("routing_executions_status")
    await collection.dropIndex("routing_executions_finishedAt")
}
