import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});
import app from "./app";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

async function connectDB() {
  try {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log("DB connection successful");
  } catch (err) {
    console.log("Connection with memory and server is stopped");

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    process.exit(1);
  }
}
connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening for request on port ${port}`);
});
