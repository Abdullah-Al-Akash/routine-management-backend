export interface ITeacher {
  fullName: string;
  sortForm: string;

  times: [
    {
      day:
        | 'Monday'
        | 'Tuesday'
        | 'Wednesday'
        | 'Thursday'
        | 'Friday'
        | 'Saturday'
        | 'Sunday';
      classesTimes: [
        {
          shift: 'Regular' | 'Evening';
          rowIndex: number;
          courseCode: string;
          startTime: string;
          endTime: string;
          period: 'am' | 'pm';
        },
      ];
    },
  ];
}
