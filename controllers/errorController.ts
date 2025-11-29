import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import AppError from "../utills/appError";
import { NextFunction, Request, Response } from "express";

function handleInvalidId() {
  return new AppError("Prosledjeni id ne postoji", 404);
}

function handleDuplicateKey(err: MongoServerError) {
  let uniqueField;

  for (const prop in err.keyValue) {
    uniqueField = prop;
  }

  return new AppError(`${uniqueField} vec postoji`, 400);
}

function sendDevelopment(error: Error, res: Response) {
  res.status(500).send({
    message: error.message,
    error,
    stack: error.stack,
  });
}

function sendProduction(error: AppError | Error, res: Response) {
  if (error instanceof AppError && error.isOperational) {
    res.status(error.statusCode).send({
      status: error.status,
      message: error.message,
      isOperational: true,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Greska u sistemu...",
    });
  }
}

function handleEmail() {
  return new AppError("Email already exists", 400);
}

const globalErrorMiddleware = function (
  error: AppError | Error | MongoServerError | mongoose.Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("evo greske", error);
  if (process.env.NODE_ENV === "development") {
    sendDevelopment(error, res);
  } else {
    let err = error;

    if ("code" in err && err.code === 11000) {
      err = handleEmail();
    }
    if (err.name === "CastError") {
      err = handleInvalidId();
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      err = handleDuplicateKey(err);
    }

    sendProduction(err, res);
  }
};

export default globalErrorMiddleware;
