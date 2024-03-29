"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    rowIndex: { type: Number },
    courseCode: { type: String },
    courseTitle: { type: String },
    teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Teacher' },
    credit: { type: Number },
    room: { type: String },
}, { _id: false });
const RoutineSchema = new mongoose_1.Schema({
    shift: { type: String, enum: ['Regular', 'Evening'] },
    courses: [CourseSchema],
    day: {
        type: String,
        enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ],
    },
    batch: { type: Number },
    yearSem: { type: String },
    sem: {
        type: String,
        enum: [
            '1st',
            '2nd',
            '3rd',
            '4th',
            '5th',
            '6th',
            '7th',
            '8th',
            '9th',
            '10th',
            '11th',
            '12th',
        ],
    },
    room: { type: String },
});
const Routine = (0, mongoose_1.model)('Routine', RoutineSchema);
exports.default = Routine;
