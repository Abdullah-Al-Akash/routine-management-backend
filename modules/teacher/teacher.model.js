"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const classTime = new mongoose_1.Schema({
    shift: { type: String, enum: ['Regular', 'Evening'] },
    rowIndex: { type: Number },
    courseCode: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    period: { type: String },
}, { _id: false });
const timesDataSchema = new mongoose_1.Schema({
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
    classesTimes: {
        type: [classTime],
    },
}, { _id: false });
const TeacherSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
    },
    sortForm: {
        type: String,
        required: true,
    },
    times: {
        type: [timesDataSchema],
    },
});
const Teacher = (0, mongoose_1.model)('Teacher', TeacherSchema);
exports.default = Teacher;
