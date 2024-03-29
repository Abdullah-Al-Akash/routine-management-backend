"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleCastError = (err) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    return {
        statusCode,
        message: 'Invalid ID',
        errorMessage: `${err.value} is not a valid ID!`,
        errorDetails: err,
    };
};
exports.default = handleCastError;
