/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import Routine from '../routine/routine.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import Teacher from './teacher.model';
import Times from '../times/times.model';

const assignTeacher = async (payload: any) => {
  const { day, shift, rowIndex, routineId, teacherId } = payload;
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

  let isTeacherAlreadyAssigned: boolean = false;

  routines.forEach((routine: any) => {
    routine.courses.forEach((course: any) => {
      if (
        course?.teacher?.toString() === teacherId &&
        course.rowIndex === parseInt(rowIndex)
      ) {
        isTeacherAlreadyAssigned = true;
      }
    });
  });

  if (isTeacherAlreadyAssigned) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Teacher is already assigned this time slot',
    );
  }

  const routine: any = await Routine.findOne({
    _id: new Types.ObjectId(routineId),
  });
  if (!routine) {
    throw new AppError(httpStatus.NOT_FOUND, 'Routine not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const teacher: any = await Teacher.findById(teacherId).session(session);

    if (!teacher) {
      throw new AppError(httpStatus.NOT_FOUND, 'Teacher not found');
    }

    const index = teacher.times.findIndex((time: any) => {
      return time.day === day;
    });

    const times = await Times.findOne({
      day,
      shift,
      rowIndex: parseInt(rowIndex),
    });

    if (!times) {
      throw new AppError(httpStatus.OK, 'time is found');
    }
    const courseCode = routine.courses.find(
      (item: any) => item.rowIndex === parseInt(rowIndex),
    ).courseCode;
    if (!teacher?.times) {
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
            startTime: times.sessionalStartTime ?? times.startTime,
            endTime: times.sessionalEndTime ?? times.endTime,
            period: times.period,
          },
        ],
      });
    } else {
      const classTimeData = {
        shift: shift,
        rowIndex: rowIndex,
        courseCode: courseCode,
        startTime: times.sessionalStartTime ?? times.startTime,
        endTime: times.sessionalEndTime ?? times.endTime,
        period: times.period,
      };

      if (!teacher.times[index]?.classesTimes && index !== -1) {
        teacher.times[index].classesTimes = [];
      }

      teacher.times[index].classesTimes.push(classTimeData);
    }

    const result = await Routine.findOneAndUpdate(
      {
        _id: new Types.ObjectId(routineId),
        'courses.rowIndex': parseInt(rowIndex),
      },
      {
        $set: { 'courses.$.teacher': new Types.ObjectId(teacherId) },
      },
      { session, new: true },
    );

    if (!result?._id) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'something went wrong try again',
      );
    }
    await teacher.save({ session });
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const getTeachers = async () => {
  const result = await Teacher.find();
  return result;
};
const getIndividualRoutine = async (id: string) => {
  if (!id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'id is required');
  }

  const result = await Routine.aggregate([
    { $unwind: '$courses' },
    { $match: { 'courses.teacher': new Types.ObjectId(id) } },
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

  return result[0]?.teacher ? result[0]?.teacher : {};
};
const insertTeachers = async (payload: any) => {
  const { teachers } = payload;
  const promises: any = [];

  const allTeacherLists = await Teacher.find();

  teachers?.forEach((teacher: any) => {
    if (
      teacher._id &&
      allTeacherLists.find((t) => t._id?.toString() === teacher?._id)
    ) {
      promises.push(
        Teacher.updateOne(
          {
            _id: new Types.ObjectId(teacher._id),
          },
          {
            $set: {
              sortForm: teacher.sortForm,
              fullName: teacher.fullName,
            },
          },
        ),
      );
    } else {
      promises.push(Teacher.create(teacher));
    }
  });

  const result = await Promise.all(promises);
  return result;
};

const TeacherServices = {
  assignTeacher,
  getTeachers,
  getIndividualRoutine,
  insertTeachers,
};

export default TeacherServices;
