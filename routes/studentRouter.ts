import express from "express";
import { signup } from "../controllers/authController";

const studentRouter = express.Router();

studentRouter.post("/", signup);

export default studentRouter;
