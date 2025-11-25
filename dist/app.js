"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const studentRouter_1 = __importDefault(require("./routes/studentRouter"));
const canteenController_1 = require("./controllers/canteenController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/students", studentRouter_1.default);
app.use("/canteens", canteenController_1.createCanteen);
app.use(errorController_1.default);
exports.default = app;
