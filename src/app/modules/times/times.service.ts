import Times from './times.model';

const getTimesSlots = async (day: string, shift: string) => {
  const times = await Times.find({ day, shift }).sort({ rowIndex: 1 });
  return times;
};

const TimesServices = { getTimesSlots };
export default TimesServices;
