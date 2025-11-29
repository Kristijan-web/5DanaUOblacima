import express from "express";
import {
  createCanteen,
  deleteCanteen,
  getCanteen,
  getCanteenByStatus,
  getCanteens,
  updateCanteen,
} from "../controllers/canteenController";
import { allowedTo, protect } from "../controllers/authController";
import {
  createRestriction,
  testRestriction,
} from "../controllers/restrictionController";

const canteenRouter = express.Router();
// protect, allowedTo("admin"),
canteenRouter.get("/", getCanteens);
canteenRouter.get("/status", getCanteensByStatus);
canteenRouter.get("/:id/status", getCanteenByStatus);
canteenRouter.get("/:id", getCanteen);
canteenRouter.post("/", createCanteen);
canteenRouter.put("/:id", updateCanteen);
canteenRouter.delete("/:id", deleteCanteen);

canteenRouter.post("/:id/restrictions", createRestriction);
canteenRouter.post("/test", testRestriction);

export default canteenRouter;
