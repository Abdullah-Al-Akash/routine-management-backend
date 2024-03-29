"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutineData = void 0;
const createRoutineData = (payload) => {
    //   const { courses } = payload;
    const modifiedData = {};
    if (Object.keys(payload).length) {
        for (const [key, value] of Object.entries(payload)) {
            if (key !== 'courses') {
                modifiedData[key] = value;
            }
        }
    }
    if (payload === null || payload === void 0 ? void 0 : payload.courses) {
        modifiedData.courses = [];
        payload.courses.map((course) => {
            const { courseCode, courseTitle, credit, rowIndex } = course;
            return modifiedData.courses.push({
                courseCode: courseCode ? courseCode : null,
                courseTitle: courseTitle ? courseTitle : null,
                credit: credit ? credit : null,
                rowIndex: rowIndex ? rowIndex : null,
            });
        });
    }
    return modifiedData;
};
exports.createRoutineData = createRoutineData;
