import { HydratedDocument } from "mongoose";
import { Response } from "express";

function sendResponse<T>(
  res: Response,
  statusCode: number,
  body: HydratedDocument<T> | HydratedDocument<T>[]
) {
  res.status(statusCode).json(body);
}

export default sendResponse;
