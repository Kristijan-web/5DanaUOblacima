"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    ime: String,
    prezime: String,
    email: String,
});
const studentModel = mongoose_1.default.model("student", studentSchema);
exports.default = studentModel;
