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
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
let mongoServer = null;
async function connectDB() {
    try {
        mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose_1.default.connect(uri);
        console.log("DB connection successful");
    }
    catch (err) {
        console.log("Connection with memory and server is stopped");
        if (mongoose_1.default.connection.readyState === 1) {
            await mongoose_1.default.connection.close();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
        process.exit(1);
    }
}
connectDB();
const port = process.env.PORT || 3000;
app_1.default.listen(port, () => {
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
