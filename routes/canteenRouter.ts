import express from "express";
import {
  createCanteen,
  deleteCanteen,
  getCanteen,
  getCanteens,
  getCanteensByStatus,
  updateCanteen,
} from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.get("/", getCanteens);
canteenRouter.get("/:id", getCanteen);
canteenRouter.post("/", createCanteen);
canteenRouter.put("/:id", updateCanteen);
canteenRouter.delete("/:id", deleteCanteen);

export default canteenRouter;
