import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import TimesServices from './times.service';

const getTimesSlots = catchAsync(async (req, res) => {
  const { day, shift } = req.query;
  const times = await TimesServices.getTimesSlots(
    day as string,
    shift as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Times fetched successfully',
    data: times,
  });
});

const TimesController = { getTimesSlots };
export default TimesController;
