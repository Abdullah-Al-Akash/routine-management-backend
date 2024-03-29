import { Schema, model } from 'mongoose';
import { ITimes } from './times.interface';

const CourseSchema = new Schema<ITimes>({
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

const Times = model<ITimes>('Time', CourseSchema);
export default Times;
