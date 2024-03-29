import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import RoutineServices from './routine.service';

const getRoutine = catchAsync(async (req, res) => {
  const result = await RoutineServices.getRoutine(
    req.query?.day as string,
    req.query?.shift as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Routine data retrieved successfully',
    data: result,
  });
});

const routineSwap = catchAsync(async (req, res) => {
  const result = await RoutineServices.routineSwap(req?.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Routine swapped successfully',
    data: result,
  });
});
const assignRoom = catchAsync(async (req, res) => {
  const result = await RoutineServices.assignRoom(req?.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Room assigned successfully',
    data: result,
  });
});
const insertRoutines = catchAsync(async (req, res) => {
  const result = await RoutineServices.insertRoutines(req?.body?.routines);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Routines inserted successfully',
    data: result,
  });
});
const addNewBatch = catchAsync(async (req, res) => {
  const result = await RoutineServices.addNewBatch();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Routines inserted successfully',
    data: result,
  });
});

const RoutineControllers = {
  getRoutine,
  routineSwap,
  assignRoom,
  insertRoutines,
  addNewBatch,
};

export default RoutineControllers;
