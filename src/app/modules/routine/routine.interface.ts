import { Types } from 'mongoose';

export interface ICourse {
  rowIndex: number;
  courseCode: string | null;
  courseTitle: string | null;
  teacher: Types.ObjectId | null;
  credit: number | null;
  room: string | null;
}

export interface IRoutine {
  shift: 'Regular' | 'Evening';
  courses: ICourse[];
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  batch: number;
  yearSem: string;
  sem:
    | '1st'
    | '2nd'
    | '3rd'
    | '4th'
    | '5th'
    | '6th'
    | '7th'
    | '8th'
    | '9th'
    | '10th'
    | '11th'
    | '12th';
  room: string;
}

// ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
