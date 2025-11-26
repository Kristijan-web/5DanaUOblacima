"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendResponse(res, statusCode, body) {
    res.status(statusCode).json(body);
}
exports.default = sendResponse;
