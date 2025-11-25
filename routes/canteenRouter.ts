import express from "express";
import { createCanteen } from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";

const canteenRouter = express.Router();

canteenRouter.post("/", protect, allowedTo("admin"), createCanteen);

export default canteenRouter;
