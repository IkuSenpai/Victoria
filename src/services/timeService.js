const { DateTime } = require('luxon');

const weekdayNumbers = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

function normalizeTimeZone(timeZone) {
  if (!timeZone) {
    return 'America/Los_Angeles';
  }

  const value = String(timeZone).trim();

  const aliases = {
    PST: 'America/Los_Angeles',
    PDT: 'America/Los_Angeles',
    PT: 'America/Los_Angeles',
    Pacific: 'America/Los_Angeles',
    'Pacific Time': 'America/Los_Angeles',
    'Pacific Standard Time': 'America/Los_Angeles',
  };

  return aliases[value] || value;
}

function parseHourMinute(time) {
  if (!time || typeof time !== 'string') {
    return null;
  }

  const match = time.trim().match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
}

function getNextWeeklyTimestamp(dayName, time, timeZone) {
  const weekday = weekdayNumbers[dayName];
  const parsedTime = parseHourMinute(time);
  const zone = normalizeTimeZone(timeZone);

  if (!weekday || !parsedTime) {
    return null;
  }

  const now = DateTime.now().setZone(zone);

  if (!now.isValid) {
    return null;
  }

  let daysUntil = (weekday - now.weekday + 7) % 7;

  let target = now
    .plus({ days: daysUntil })
    .set({
      hour: parsedTime.hour,
      minute: parsedTime.minute,
      second: 0,
      millisecond: 0,
    });

  if (target <= now) {
    target = target.plus({ days: 7 });
  }

  return Math.floor(target.toUTC().toSeconds());
}

function formatDiscordCountdown(unixTimestamp) {
  if (!unixTimestamp) {
    return null;
  }

  return `<t:${unixTimestamp}:R> (<t:${unixTimestamp}:f>)`;
}

module.exports = {
  normalizeTimeZone,
  getNextWeeklyTimestamp,
  formatDiscordCountdown,
};
