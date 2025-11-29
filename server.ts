import dotenv from "dotenv";
dotenv.config({
  path: "./config.env",
});
import app from "./app";

// COMMENTED OUT - Switched to MongoDB Atlas
// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// let mongoServer: MongoMemoryServer | null = null;

async function connectDB() {
  const mongoUri = process.env.DATABASE || '';

  if (!mongoUri) {
    console.error('❌ DATABASE not found in config.env');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log("✅ DB connection successful");
  } catch (err) {
    console.error("❌ MongoDB Atlas connection failed:", err);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
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
