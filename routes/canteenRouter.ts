import express from "express";
import { createCanteen } from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.post("/", createCanteen);

export default canteenRouter;
