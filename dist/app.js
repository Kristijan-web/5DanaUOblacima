"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const studentRouter_1 = __importDefault(require("./routes/studentRouter"));
const canteenRouter_1 = __importDefault(require("./routes/canteenRouter"));
const reservationRouter_1 = __importDefault(require("./routes/reservationRouter"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/students", studentRouter_1.default);
app.use("/canteens", canteenRouter_1.default);
app.use("/reservations", reservationRouter_1.default);
app.use(errorController_1.default);
exports.default = app;
