import express from "express";
import globalErrorMiddleware from "./controllers/errorController";
import studentRouter from "./routes/studentRouter";
import { createCanteen } from "./controllers/canteenController";

const app = express();

app.use(express.json());

app.use("/students", studentRouter);
app.use("/canteens", createCanteen);

app.use(globalErrorMiddleware);

export default app;
