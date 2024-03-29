"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handleDuplicateError_1 = __importDefault(require("../errors/handleDuplicateError"));
const handleValidationError_1 = __importDefault(require("../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errors/handleCastError"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    // here default values
    let statusCode = 500;
    let message = 'Internal server error!';
    let errorMessage = '';
    let errorDetails = {};
    // handle zod error
    if (err instanceof zod_1.ZodError) {
        const handledError = (0, handleZodError_1.default)(err);
        statusCode = handledError === null || handledError === void 0 ? void 0 : handledError.statusCode;
        message = handledError === null || handledError === void 0 ? void 0 : handledError.message;
        errorMessage = handledError === null || handledError === void 0 ? void 0 : handledError.errorMessage;
        errorDetails = handledError.errorDetails;
    }
    // handle duplicate error
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const handledError = (0, handleDuplicateError_1.default)(err);
        statusCode = handledError === null || handledError === void 0 ? void 0 : handledError.statusCode;
        message = handledError === null || handledError === void 0 ? void 0 : handledError.message;
        errorMessage = handledError === null || handledError === void 0 ? void 0 : handledError.errorMessage;
        errorDetails = handledError.errorDetails;
    }
    // handle validation error
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'ValidationError') {
        const handledError = (0, handleValidationError_1.default)(err);
        statusCode = handledError === null || handledError === void 0 ? void 0 : handledError.statusCode;
        message = handledError === null || handledError === void 0 ? void 0 : handledError.message;
        errorMessage = handledError === null || handledError === void 0 ? void 0 : handledError.errorMessage;
        errorDetails = handledError.errorDetails;
    }
    // handle cast error
    else if ((err === null || err === void 0 ? void 0 : err.name) === 'CastError') {
        const handledError = (0, handleCastError_1.default)(err);
        statusCode = handledError === null || handledError === void 0 ? void 0 : handledError.statusCode;
        message = handledError === null || handledError === void 0 ? void 0 : handledError.message;
        errorMessage = handledError === null || handledError === void 0 ? void 0 : handledError.errorMessage;
        errorDetails = handledError.errorDetails;
    }
    // handle custom app error
    else if (err instanceof AppError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err.message;
    }
    //  handle default throw new Error
    else if (err instanceof Error) {
        message = err.message;
    }
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Unauthorized Access';
        errorMessage =
            'You do not have the necessary permissions to access this resource.';
        errorDetails = null;
        err.stack = null;
    }
    //   send error response
    return res.status(statusCode).json({
        success: false,
        message,
        errorMessage,
        errorDetails,
        stack: (err === null || err === void 0 ? void 0 : err.stack) || null,
    });
};
exports.default = globalErrorHandler;
