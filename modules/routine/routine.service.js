"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routine_model_1 = __importDefault(require("./routine.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const routine_utils_1 = require("./routine.utils");
const getRoutine = (day, shift) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield routine_model_1.default.find({ day, shift })
        .populate('courses.teacher')
        .sort({ batch: -1 });
    return result;
});
const routineSwap = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { routineId, firstRowIndex, secondRowIndex } = payload;
    if (!routineId || !firstRowIndex || !secondRowIndex) {
        throw new Error('Routine Id, firstRowIndex, secondRowIndex is required');
    }
    const routine = yield routine_model_1.default.findById(routineId);
    if (!routine) {
        throw new Error('Routine not found');
    }
    if (firstRowIndex === secondRowIndex) {
        throw new Error('Rows cannot be same');
    }
    if (parseInt(firstRowIndex) > 11 && parseInt(secondRowIndex) > 11) {
        throw new Error('max row is 10');
    }
    const _a = routine.courses.find((item) => item.rowIndex === parseInt(firstRowIndex)), { rowIndex: rowIndex1 } = _a, firstRoutineValues = __rest(_a, ["rowIndex"]);
    const _b = routine.courses.find((item) => item.rowIndex === parseInt(secondRowIndex)), { rowIndex: rowIndex2 } = _b, secondRoutineValues = __rest(_b, ["rowIndex"]);
    if (firstRoutineValues.credit !== secondRoutineValues.credit) {
        throw new Error('Credit must be same');
    }
    routine.courses = routine.courses.map((item) => {
        if (item.rowIndex === parseInt(firstRowIndex)) {
            item = Object.assign({ rowIndex: parseInt(firstRowIndex) }, secondRoutineValues);
        }
        if (item.rowIndex === parseInt(secondRowIndex)) {
            item = Object.assign({ rowIndex: parseInt(secondRowIndex) }, firstRoutineValues);
        }
        return item;
    });
    const result = yield routine.save();
    return result;
});
const assignRoom = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { day, shift, rowIndex, routineId, roomNumber } = payload;
    if (!day || !shift || !rowIndex || !routineId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'day and teacherId and rowIndex and routineId are required');
    }
    const routines = yield routine_model_1.default.find({
        day: day,
        shift: shift,
    });
    let isRoomAlreadyAssigned = false;
    routines.forEach((routine) => {
        routine.courses.forEach((course) => {
            if ((course === null || course === void 0 ? void 0 : course.room) === roomNumber &&
                course.rowIndex === parseInt(rowIndex)) {
                isRoomAlreadyAssigned = true;
            }
        });
    });
    if (isRoomAlreadyAssigned) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'room is already assigned this time slot');
    }
    const routine = yield routine_model_1.default.findOne({
        _id: new mongoose_1.Types.ObjectId(routineId),
        'courses.rowIndex': rowIndex,
    });
    if (!routine) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Routine not found');
    }
    if (routine.courses.find((item) => item.credit !== 1.5 && item.rowIndex === parseInt(rowIndex))) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Room assign on for 1.5 credit course');
    }
    const result = yield routine_model_1.default.findOneAndUpdate({
        _id: new mongoose_1.Types.ObjectId(routineId),
        'courses.rowIndex': parseInt(rowIndex),
    }, {
        $set: { 'courses.$.room': roomNumber },
    }, { upsert: true, new: true });
    return result;
});
const insertRoutines = (routines) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    const allRoutineLists = yield routine_model_1.default.find();
    routines === null || routines === void 0 ? void 0 : routines.forEach((routine) => {
        if (routine._id &&
            allRoutineLists.find((t) => { var _a; return ((_a = t._id) === null || _a === void 0 ? void 0 : _a.toString()) === (routine === null || routine === void 0 ? void 0 : routine._id); })) {
            promises.push(routine_model_1.default.updateOne({
                _id: new mongoose_1.Types.ObjectId(routine._id),
            }, {
                $set: Object.assign({}, (0, routine_utils_1.createRoutineData)(routine)),
            }));
        }
        else {
            if (allRoutineLists.length < 90) {
                promises.push(routine_model_1.default.create(Object.assign({}, (0, routine_utils_1.createRoutineData)(routine))));
            }
        }
    });
    const result = yield Promise.all(promises);
    return result;
    // const result = await Routine.insertMany(data);
    // return result;
});
const addNewBatch = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield routine_model_1.default.updateMany({}, { $inc: { batch: 1 } });
    return result;
});
const RoutineServices = {
    getRoutine,
    routineSwap,
    assignRoom,
    insertRoutines,
    addNewBatch,
};
exports.default = RoutineServices;
