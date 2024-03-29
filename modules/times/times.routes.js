"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const times_controller_1 = __importDefault(require("./times.controller"));
const router = (0, express_1.Router)();
router.get('/get-times-slots', times_controller_1.default.getTimesSlots);
const TimesRoutes = router;
exports.default = TimesRoutes;
