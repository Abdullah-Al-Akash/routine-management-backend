"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routine_controller_1 = __importDefault(require("./routine.controller"));
const router = (0, express_1.Router)();
router.get('/', routine_controller_1.default.getRoutine);
router.patch('/swap', routine_controller_1.default.routineSwap);
router.patch('/assign-room', routine_controller_1.default.assignRoom);
router.post('/insert-routines', routine_controller_1.default.insertRoutines);
router.patch('/add-new-batch', routine_controller_1.default.addNewBatch);
const RoutineRoutes = router;
exports.default = RoutineRoutes;
