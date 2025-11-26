import express from "express";
import { signup } from "../controllers/authController";
import {
  deleteStudent,
  getStudent,
  getStudents,
  updateStudent,
} from "../controllers/studentsController";

const studentRouter = express.Router();

studentRouter.get("/", getStudents);
studentRouter.get("/:id", getStudent);
studentRouter.post("/", signup);
studentRouter.patch("/:id", updateStudent);
studentRouter.delete("/:d", deleteStudent);

export default studentRouter;
