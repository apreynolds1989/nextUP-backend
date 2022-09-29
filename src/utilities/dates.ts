import { DateTime } from 'luxon';

export const currentDate = '2022-01-06';

export const endOfWeekDate = '2022-01-12';

const luxDate = DateTime.now();
const luxCurrentWeekday = luxDate.toFormat('cccc');
const luxCurrentDate = luxDate.toFormat("yyyy'-'LL'-'dd");
const luxEndOfWeekDate = luxDate.endOf('week').toFormat("yyyy'-'LL'-'dd");
