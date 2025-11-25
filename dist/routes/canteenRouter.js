"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canteenController_1 = require("../controllers/canteenController");
const authController_1 = require("../controllers/authController");
const canteenRouter = express_1.default.Router();
canteenRouter.post("/", authController_1.protect, (0, authController_1.allowedTo)("admin"), canteenController_1.createCanteen);
exports.default = canteenRouter;
