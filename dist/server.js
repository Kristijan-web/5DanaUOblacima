"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: "./config.env",
});
const app_1 = __importDefault(require("./app"));
// COMMENTED OUT - Switched to MongoDB Atlas
// import { MongoMemoryServer } from "mongodb-memory-server";
const mongoose_1 = __importDefault(require("mongoose"));
// let mongoServer: MongoMemoryServer | null = null;
async function connectDB() {
    const mongoUri = process.env.DATABASE || '';
    if (!mongoUri) {
        console.error('❌ DATABASE not found in config.env');
        process.exit(1);
    }
    try {
        console.log('📡 Connecting to MongoDB Atlas...');
        await mongoose_1.default.connect(mongoUri);
        console.log("✅ DB connection successful");
    }
    catch (err) {
        console.error("❌ MongoDB Atlas connection failed:", err);
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.connection.close();
        }
        process.exit(1);
    }
}
connectDB();
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
    console.log(`Listening for request on port ${port}`);
});
