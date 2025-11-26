"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canteenController_1 = require("../controllers/canteenController");
const canteenRouter = express_1.default.Router();
// protect, allowedTo("admin"),
canteenRouter.post("/", canteenController_1.createCanteen);
canteenRouter.patch("/:id", canteenController_1.updateCanteen);
exports.default = canteenRouter;
