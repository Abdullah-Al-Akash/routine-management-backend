"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    courseCode: { type: String, required: true },
    courseShift: {
        type: String,
        enum: ['Regular', 'Evening'],
        required: true,
    },
    courseTitle: { type: String, required: true },
    credit: { type: String, required: true },
});
const Course = (0, mongoose_1.model)('Course', CourseSchema);
exports.default = Course;
