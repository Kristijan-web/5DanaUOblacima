"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const studentsController_1 = require("../controllers/studentsController");
const studentRouter = express_1.default.Router();
studentRouter.get("/", studentsController_1.getStudents);
studentRouter.get("/:id", studentsController_1.getStudent);
studentRouter.post("/", authController_1.signup);
studentRouter.patch("/:id", studentsController_1.updateStudent);
studentRouter.delete("/:d", studentsController_1.deleteStudent);
exports.default = studentRouter;
