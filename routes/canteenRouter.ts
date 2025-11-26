import express from "express";
import {
  createCanteen,
  deleteCanteen,
  getCanteen,
  getCanteens,
  updateCanteen,
} from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.get("/", getCanteens);
canteenRouter.get("/:id", getCanteen);
canteenRouter.post("/", createCanteen);
canteenRouter.patch("/:id", updateCanteen);
canteenRouter.delete("/:Id", deleteCanteen);

export default canteenRouter;
