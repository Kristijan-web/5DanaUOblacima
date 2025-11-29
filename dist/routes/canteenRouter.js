"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canteenController_1 = require("../controllers/canteenController");
const restrictionController_1 = require("../controllers/restrictionController");
const canteenRouter = express_1.default.Router();
// protect, allowedTo("admin"),
canteenRouter.get("/", canteenController_1.getCanteens);
canteenRouter.get("/:id", canteenController_1.getCanteen);
canteenRouter.post("/", canteenController_1.createCanteen);
canteenRouter.put("/:id", canteenController_1.updateCanteen);
canteenRouter.delete("/:id", canteenController_1.deleteCanteen);
canteenRouter.post("/:id/restrictions", restrictionController_1.createRestriction);
exports.default = canteenRouter;
