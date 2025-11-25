import express from "express";
import { createReservation } from "../controllers/reservationController";

const reservationRouter = express.Router();

reservationRouter.post("/", createReservation);

export default reservationRouter;
