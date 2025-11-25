import { Request, Response } from "express";
import AppError from "./appError";

// Wraper funkcija za asinhrone funkcije
// - Sprava ponavljanje try catch bloka
// - sve programmatic greske (neuhvacene) delegira global error handling middleware-u

type AppNext = (err?: AppError) => void;

const catchAsync = function (
  fn: (req: Request, res: Response, next: AppNext) => Promise<void>
) {
  return (req: Request, res: Response, next: AppNext) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default catchAsync;
