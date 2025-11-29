import express from "express";
import {
  createReservation,
  getReservation,
  getReservations,
} from "../controllers/reservationController";

const reservationRouter = express.Router();

reservationRouter.get("/", getReservations);
reservationRouter.get("/:id", getReservation);
reservationRouter.post("/", createReservation);

export default reservationRouter;
