import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import TeacherServices from './teacher.service';

const assignTeacher = catchAsync(async (req, res) => {
  const result = await TeacherServices.assignTeacher(req?.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Teacher assigned successfully',
    data: result,
  });
});
const getTeachers = catchAsync(async (req, res) => {
  const result = await TeacherServices.getTeachers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Teacher retrieved successfully',
    data: result,
  });
});
const getIndividualRoutine = catchAsync(async (req, res) => {
  const result = await TeacherServices.getIndividualRoutine(
    req?.params?.teacherId,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Teacher retrieved successfully',
    data: result,
  });
});
const insertTeachers = catchAsync(async (req, res) => {
  const result = await TeacherServices.insertTeachers(req?.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Teacher inserted successfully',
    data: result,
  });
});

const TeacherControllers = {
  assignTeacher,
  getTeachers,
  getIndividualRoutine,
  insertTeachers,
};

export default TeacherControllers;
