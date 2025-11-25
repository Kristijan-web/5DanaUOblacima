import express from "express";
import { createCanteen } from "../controllers/canteenController";

const canteenRouter = express.Router();

canteenRouter.post("/", createCanteen);

export default canteenRouter;
