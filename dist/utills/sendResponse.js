"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sendResponse(res, statusCode, data) {
    res.status(statusCode).json(data);
}
exports.default = sendResponse;
