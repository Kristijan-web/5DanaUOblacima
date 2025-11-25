import { Request, Response } from "express";
import AppError from "./appError";

type AppNext = (err?: AppError) => void;

const catchAsync = function (
  fn: (req: Request, res: Response, next: AppNext) => Promise<void>
) {
  return (req: Request, res: Response, next: AppNext) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default catchAsync;
