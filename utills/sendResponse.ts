import { HydratedDocument } from "mongoose";
import { Response } from "express";

function sendResponse<T>(
  res: Response,
  statusCode: number,
  data: HydratedDocument<T> | HydratedDocument<T>[]
) {
  res.status(statusCode).json(data);
}

export default sendResponse;
