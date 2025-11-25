import express from "express";
import { createStudent } from "../controllers/studentController";

const studentRouter = express.Router();

studentRouter.post("/", createStudent);

export default studentRouter;
