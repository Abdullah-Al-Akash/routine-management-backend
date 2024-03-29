/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICourse } from './routine.interface';

export const createRoutineData = (payload: any): object => {
  //   const { courses } = payload;

  const modifiedData: any = {};

  if (Object.keys(payload).length) {
    for (const [key, value] of Object.entries(payload)) {
      if (key !== 'courses') {
        modifiedData[key as string] = value;
      }
    }
  }

  if (payload?.courses) {
    modifiedData.courses = [];
    payload.courses.map((course: ICourse) => {
      const { courseCode, courseTitle, credit, rowIndex } = course;

      return modifiedData.courses.push({
        courseCode: courseCode ? courseCode : null,
        courseTitle: courseTitle ? courseTitle : null,
        credit: credit ? credit : null,
        rowIndex: rowIndex ? rowIndex : null,
      });
    });
  }
  return modifiedData;
};
