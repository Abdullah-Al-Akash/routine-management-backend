export interface ITimes {
  shift: 'Regular' | 'Evening';
  day:
    | 'Monday'
    | 'Tuesday'
    | 'Wednesday'
    | 'Thursday'
    | 'Friday'
    | 'Saturday'
    | 'Sunday';
  rowIndex: number;
  startTime: string;
  endTime: string;
  sessionalStartTime: string;
  sessionalEndTime: string;
  period: 'am' | 'pm';
}
