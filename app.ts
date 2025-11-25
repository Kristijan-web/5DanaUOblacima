import express from "express";
import globalErrorMiddleware from "./controllers/errorController";
import studentRouter from "./routes/studentRouter";

const app = express();

app.use(express.json());

app.use("/students", studentRouter);

app.use(globalErrorMiddleware);

export default app;
