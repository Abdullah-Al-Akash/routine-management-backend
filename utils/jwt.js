"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenOption = void 0;
const config_1 = __importDefault(require("../config"));
const sendResponse_1 = __importDefault(require("./sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
exports.refreshTokenOption = {
    exprire: config_1.default.jwt_refresh_expires_in,
    httpOnly: config_1.default.env === 'production',
    secure: config_1.default.env === 'production',
};
const sendToken = (user, res, message) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    res.cookie('refresh_token', refreshToken, exports.refreshTokenOption);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: message,
        data: { accessToken },
    });
};
exports.default = sendToken;
