"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importStar(require("mongoose"));
const routine_model_1 = __importDefault(require("../routine/routine.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const teacher_model_1 = __importDefault(require("./teacher.model"));
const times_model_1 = __importDefault(require("../times/times.model"));
const assignTeacher = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { day, shift, rowIndex, routineId, teacherId } = payload;
    if (!day || !shift || !rowIndex || !routineId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'day and teacherId and rowIndex and routineId are required');
    }
    const routines = yield routine_model_1.default.find({
        day: day,
        shift: shift,
    });
    let isTeacherAlreadyAssigned = false;
    routines.forEach((routine) => {
        routine.courses.forEach((course) => {
            var _a;
            if (((_a = course === null || course === void 0 ? void 0 : course.teacher) === null || _a === void 0 ? void 0 : _a.toString()) === teacherId &&
                course.rowIndex === parseInt(rowIndex)) {
                isTeacherAlreadyAssigned = true;
            }
        });
    });
    if (isTeacherAlreadyAssigned) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Teacher is already assigned this time slot');
    }
    const routine = yield routine_model_1.default.findOne({
        _id: new mongoose_1.Types.ObjectId(routineId),
    });
    if (!routine) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Routine not found');
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const teacher = yield teacher_model_1.default.findById(teacherId).session(session);
        if (!teacher) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Teacher not found');
        }
        const index = teacher.times.findIndex((time) => {
            return time.day === day;
        });
        const times = yield times_model_1.default.findOne({
            day,
            shift,
            rowIndex: parseInt(rowIndex),
        });
        if (!times) {
            throw new AppError_1.default(http_status_1.default.OK, 'time is found');
        }
        const courseCode = routine.courses.find((item) => item.rowIndex === parseInt(rowIndex)).courseCode;
        if (!(teacher === null || teacher === void 0 ? void 0 : teacher.times)) {
            teacher.times = [];
        }
        if (index === -1) {
            teacher.times.push({
                day: day,
                classesTimes: [
                    {
                        shift: shift,
                        rowIndex: rowIndex,
                        courseCode: courseCode,
                        startTime: (_a = times.sessionalStartTime) !== null && _a !== void 0 ? _a : times.startTime,
                        endTime: (_b = times.sessionalEndTime) !== null && _b !== void 0 ? _b : times.endTime,
                        period: times.period,
                    },
                ],
            });
        }
        else {
            const classTimeData = {
                shift: shift,
                rowIndex: rowIndex,
                courseCode: courseCode,
                startTime: (_c = times.sessionalStartTime) !== null && _c !== void 0 ? _c : times.startTime,
                endTime: (_d = times.sessionalEndTime) !== null && _d !== void 0 ? _d : times.endTime,
                period: times.period,
            };
            if (!((_e = teacher.times[index]) === null || _e === void 0 ? void 0 : _e.classesTimes) && index !== -1) {
                teacher.times[index].classesTimes = [];
            }
            teacher.times[index].classesTimes.push(classTimeData);
        }
        const result = yield routine_model_1.default.findOneAndUpdate({
            _id: new mongoose_1.Types.ObjectId(routineId),
            'courses.rowIndex': parseInt(rowIndex),
        }, {
            $set: { 'courses.$.teacher': new mongoose_1.Types.ObjectId(teacherId) },
        }, { session, new: true });
        if (!(result === null || result === void 0 ? void 0 : result._id)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'something went wrong try again');
        }
        yield teacher.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, error.message);
    }
});
const getTeachers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield teacher_model_1.default.find();
    return result;
});
const getIndividualRoutine = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    if (!id) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'id is required');
    }
    const result = yield routine_model_1.default.aggregate([
        { $unwind: '$courses' },
        { $match: { 'courses.teacher': new mongoose_1.Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'teachers', // Assuming the collection name is 'teachers'
                localField: 'courses.teacher',
                foreignField: '_id',
                as: 'teacher',
            },
        },
        { $unwind: '$teacher' },
    ]);
    return ((_f = result[0]) === null || _f === void 0 ? void 0 : _f.teacher) ? (_g = result[0]) === null || _g === void 0 ? void 0 : _g.teacher : {};
});
const insertTeachers = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { teachers } = payload;
    const promises = [];
    const allTeacherLists = yield teacher_model_1.default.find();
    teachers === null || teachers === void 0 ? void 0 : teachers.forEach((teacher) => {
        if (teacher._id &&
            allTeacherLists.find((t) => { var _a; return ((_a = t._id) === null || _a === void 0 ? void 0 : _a.toString()) === (teacher === null || teacher === void 0 ? void 0 : teacher._id); })) {
            promises.push(teacher_model_1.default.updateOne({
                _id: new mongoose_1.Types.ObjectId(teacher._id),
            }, {
                $set: {
                    sortForm: teacher.sortForm,
                    fullName: teacher.fullName,
                },
            }));
        }
        else {
            promises.push(teacher_model_1.default.create(teacher));
        }
    });
    const result = yield Promise.all(promises);
    return result;
});
const TeacherServices = {
    assignTeacher,
    getTeachers,
    getIndividualRoutine,
    insertTeachers,
};
exports.default = TeacherServices;
