import { Schema, model } from 'mongoose';
import { ICourse, IRoutine } from './routine.interface';

const CourseSchema = new Schema<ICourse>(
  {
    rowIndex: { type: Number },
    courseCode: { type: String },
    courseTitle: { type: String },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    credit: { type: Number },
    room: { type: String },
  },
  { _id: false },
);

const RoutineSchema = new Schema<IRoutine>({
  shift: { type: String, enum: ['Regular', 'Evening'] },
  courses: [CourseSchema],
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
  batch: { type: Number },
  yearSem: { type: String },
  sem: {
    type: String,
    enum: [
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th',
      '11th',
      '12th',
    ],
  },
  room: { type: String },
});

const Routine = model<IRoutine>('Routine', RoutineSchema);

export default Routine;
