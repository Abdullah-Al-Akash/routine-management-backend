"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const times_routes_1 = __importDefault(require("../modules/times/times.routes"));
const routine_routes_1 = __importDefault(require("../modules/routine/routine.routes"));
const teacher_routes_1 = __importDefault(require("../modules/teacher/teacher.routes"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/times', route: times_routes_1.default },
    { path: '/routine', route: routine_routes_1.default },
    { path: '/teacher', route: teacher_routes_1.default },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
