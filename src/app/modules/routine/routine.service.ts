/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Routine from './routine.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { createRoutineData } from './routine.utils';

const getRoutine = async (day: string, shift: string) => {
  const result = await Routine.find({ day, shift })
    .populate('courses.teacher')
    .sort({ batch: -1 });
  return result;
};
const routineSwap = async (payload: any) => {
  const { routineId, firstRowIndex, secondRowIndex } = payload as {
    routineId: string;
    firstRowIndex: string;
    secondRowIndex: string;
  };

  if (!routineId || !firstRowIndex || !secondRowIndex) {
    throw new Error('Routine Id, firstRowIndex, secondRowIndex is required');
  }

  const routine: any = await Routine.findById(routineId);

  if (!routine) {
    throw new Error('Routine not found');
  }

  if (firstRowIndex === secondRowIndex) {
    throw new Error('Rows cannot be same');
  }

  if (parseInt(firstRowIndex) > 11 && parseInt(secondRowIndex) > 11) {
    throw new Error('max row is 10');
  }
  type index = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  const { rowIndex: rowIndex1, ...firstRoutineValues }: any =
    routine.courses.find(
      (item: any) => item.rowIndex === parseInt(firstRowIndex),
    );
  const { rowIndex: rowIndex2, ...secondRoutineValues }: any =
    routine.courses.find(
      (item: any) => item.rowIndex === parseInt(secondRowIndex),
    );

  if (firstRoutineValues.credit !== secondRoutineValues.credit) {
    throw new Error('Credit must be same');
  }

  routine.courses = routine.courses.map((item: any) => {
    if (item.rowIndex === parseInt(firstRowIndex)) {
      item = {
        rowIndex: parseInt(firstRowIndex),
        ...secondRoutineValues,
      };
    }
    if (item.rowIndex === parseInt(secondRowIndex)) {
      item = {
        rowIndex: parseInt(secondRowIndex),
        ...firstRoutineValues,
      };
    }
    return item;
  });

  const result = await routine.save();

  return result;
};

const assignRoom = async (payload: any) => {
  const { day, shift, rowIndex, routineId, roomNumber } = payload;
  if (!day || !shift || !rowIndex || !routineId) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'day and teacherId and rowIndex and routineId are required',
    );
  }

  const routines = await Routine.find({
    day: day,
    shift: shift,
  });

  let isRoomAlreadyAssigned: boolean = false;

  routines.forEach((routine: any) => {
    routine.courses.forEach((course: any) => {
      if (
        course?.room === roomNumber &&
        course.rowIndex === parseInt(rowIndex)
      ) {
        isRoomAlreadyAssigned = true;
      }
    });
  });

  if (isRoomAlreadyAssigned) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'room is already assigned this time slot',
    );
  }

  const routine: any = await Routine.findOne({
    _id: new Types.ObjectId(routineId),
    'courses.rowIndex': rowIndex,
  });

  if (!routine) {
    throw new AppError(httpStatus.NOT_FOUND, 'Routine not found');
  }
  if (
    routine.courses.find(
      (item: any) =>
        item.credit !== 1.5 && item.rowIndex === parseInt(rowIndex),
    )
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Room assign on for 1.5 credit course',
    );
  }

  const result = await Routine.findOneAndUpdate(
    {
      _id: new Types.ObjectId(routineId),
      'courses.rowIndex': parseInt(rowIndex),
    },
    {
      $set: { 'courses.$.room': roomNumber },
    },
    { upsert: true, new: true },
  );

  return result;
};

const insertRoutines = async (routines: any) => {
  const promises: any = [];

  const allRoutineLists = await Routine.find();

  routines?.forEach((routine: any) => {
    if (
      routine._id &&
      allRoutineLists.find((t) => t._id?.toString() === routine?._id)
    ) {
      promises.push(
        Routine.updateOne(
          {
            _id: new Types.ObjectId(routine._id),
          },
          {
            $set: { ...createRoutineData(routine) },
          },
        ),
      );
    } else {
      if (allRoutineLists.length < 90) {
        promises.push(
          Routine.create({
            ...createRoutineData(routine),
          }),
        );
      }
    }
  });

  const result = await Promise.all(promises);
  return result;

  // const result = await Routine.insertMany(data);
  // return result;
};
const addNewBatch = async () => {
  const result = await Routine.updateMany({}, { $inc: { batch: 1 } });
  return result;
};

const RoutineServices = {
  getRoutine,
  routineSwap,
  assignRoom,
  insertRoutines,
  addNewBatch,
};

export default RoutineServices;
