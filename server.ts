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
// Da bude persittant baza:
//
// if (!process.env.CONNECTION_STRING || !process.env.DB_PASSWORD) {
//   console.log("No connection string or password");
//   process.exit(1);
// }

// const CONNECTION_STRING = process.env.CONNECTION_STRING.replace(
//   "DB_PASSWORD",
//   process.env.DB_PASSWORD
// );

// mongoose.connect(CONNECTION_STRING).then(() => {
//   console.log("Db connection succesful");
// });

// Promise.all([
//   User.init(),
//   // Product.init(),
//   // Order.init(),
// ]);
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Listening for requests on port ${PORT}`);
// });
