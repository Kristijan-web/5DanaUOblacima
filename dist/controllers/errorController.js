"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utills/appError"));
function sendDevelopment(error, res) {
    res.status(500).send({
        message: error.message,
        error,
        stack: error.stack,
    });
}
function sendProduction(error, res) {
    if (error instanceof appError_1.default && error.isOperational) {
        res.status(error.statusCode).send({
            status: error.status,
            message: error.message,
            isOperational: true,
        });
    }
    else {
        res.status(500).send({
            status: "error",
            message: "Greska u sistemu...",
        });
    }
}
const globalErrorMiddleware = function (error, req, res, next) {
    console.log("evo greske", error);
    if (process.env.NODE_ENV === "development") {
        sendDevelopment(error, res);
    }
    else {
        let err = error;
        sendProduction(err, res);
    }
};
exports.default = globalErrorMiddleware;
