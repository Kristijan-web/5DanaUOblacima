import express from "express";
import globalErrorMiddleware from "./controllers/errorController";
import studentRouter from "./routes/studentRouter";
import { createCanteen } from "./controllers/canteenController";
import canteenRouter from "./routes/canteenRouter";
import reservationRouter from "./routes/reservationRouter";

const app = express();

app.use(express.json());

app.use("/students", studentRouter);
app.use("/canteens", canteenRouter);
app.use("/reservations", reservationRouter);

app.use(globalErrorMiddleware);

export default app;
