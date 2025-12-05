import { connectMongo, disconnectMongo } from "@/infra/config/mongoConnection";
import { createAdminSeeder } from "./create-admin.seeder";

async function seed() {
  await connectMongo();

  console.log("Seeding database...");
  await createAdminSeeder();

  await disconnectMongo();
  console.log("Database seeded successfully");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
