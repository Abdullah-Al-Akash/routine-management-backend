"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CourseSchema = new mongoose_1.Schema({
    rowIndex: {
        type: Number,
    },
    shift: { type: String, enum: ['Regular', 'Evening'] },
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
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    sessionalStartTime: {
        type: String,
        default: null,
    },
    sessionalEndTime: {
        type: String,
        default: null,
    },
    period: { type: String, enum: ['am', 'pm'] },
});
const Times = (0, mongoose_1.model)('Time', CourseSchema);
exports.default = Times;
