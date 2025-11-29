import express from "express";
import {
  createCanteen,
  deleteCanteen,
  getCanteen,
  getCanteens,
  updateCanteen,
} from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";
import { createRestriction } from "../controllers/restrictionController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.get("/", getCanteens);
canteenRouter.get("/:id", getCanteen);
canteenRouter.post("/", createCanteen);
canteenRouter.put("/:id", updateCanteen);
canteenRouter.delete("/:id", deleteCanteen);

canteenRouter.post("/:id/restrictions", createRestriction);

export default canteenRouter;
