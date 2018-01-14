import moment from 'moment';

const bank = ({ tmobile, ing, idea, initial, firstDay = 10 } = {}) => {
  const now = moment();
  const nextMonth = moment();
  if (nextMonth.date() < firstDay) {
    nextMonth.date(firstDay);
  } else {
    nextMonth.add(1, 'month');
    nextMonth.date(firstDay);
  }
  const prevMonth = moment(nextMonth).subtract(1, 'month');
  const daysPassed = now.diff(prevMonth, 'days');
  const daysLeft = nextMonth.diff(now, 'days');
  const totalDays = nextMonth.diff(prevMonth, 'days');
  const perDayExpected = initial / totalDays;
  const expected = daysLeft * perDayExpected;

  return {
    prevMonth,
    now,
    nextMonth,
    daysPassed,
    daysLeft,
    totalDays,
    perDayExpected,
    expected,
    left: tmobile,
    perDay: tmobile / daysLeft,
    deficit: expected - tmobile,
  };
};

export default bank;
