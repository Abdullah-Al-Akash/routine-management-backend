"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacher_controller_1 = __importDefault(require("./teacher.controller"));
const router = (0, express_1.Router)();
router.patch('/assign', teacher_controller_1.default.assignTeacher);
router.get('/', teacher_controller_1.default.getTeachers);
router.get('/get-individual-routine/:teacherId', teacher_controller_1.default.getIndividualRoutine);
router.post('/insert-teachers', teacher_controller_1.default.insertTeachers);
const TeacherRoutes = router;
exports.default = TeacherRoutes;
