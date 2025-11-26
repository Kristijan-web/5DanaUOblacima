import express from "express";
import { createCanteen, updateCanteen } from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.post("/", createCanteen);
canteenRouter.patch("/:id", updateCanteen);

export default canteenRouter;
