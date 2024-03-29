import { Schema, model } from 'mongoose';
import { ITeacher } from './teacher.interface';

const classTime = new Schema(
  {
    shift: { type: String, enum: ['Regular', 'Evening'] },
    rowIndex: { type: Number },
    courseCode: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    period: { type: String },
  },
  { _id: false },
);

const timesDataSchema = new Schema(
  {
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
    classesTimes: {
      type: [classTime],
    },
  },
  { _id: false },
);

const TeacherSchema = new Schema<ITeacher>({
  fullName: {
    type: String,
    required: true,
  },
  sortForm: {
    type: String,
    required: true,
  },
  times: {
    type: [timesDataSchema],
  },
});

const Teacher = model<ITeacher>('Teacher', TeacherSchema);

export default Teacher;
