export const parseTimeInMinutes = (goalTime: {
  hour: number;
  minute: number;
  second: number;
}) => {
  return goalTime.hour * 60 + goalTime.minute + goalTime.second / 60;
};
