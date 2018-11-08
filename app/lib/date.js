import moment from 'moment';
import 'moment-duration-format';

// gets the clock time formatter
const getTimeFormatter = (withSeconds = false) => (
  `h:mm${withSeconds ? ':ss' : ''} A`
);

// gets the calendar date formatter
const getDateFormatter = (withSeconds = false, withYear = true) => (
  `ddd Do MMM${withYear ? ' YY' : ''} [at] ${getTimeFormatter(withSeconds)}`
);

// gets a friendly, relative date string, optionally with seconds,
// and optionally with relative date names in lowercase
//
// For example:
//   "Today at 12:03 PM"
//   "yesterday at 11:01 AM"
//   "Wed 13 Nov at 1:00 AM"
//   "Fri 1 Jan 2012 at 4:02 PM"
export function getRelativeDateString(time, options = {}) {
  const formats = Object.assign({}, moment.localeData()._calendar);
  const timeFormat = getTimeFormatter(options.seconds);

  if (!options.inPast) {
    formats.lastWeek = formats.lastWeek.replace('[Last] ', '');
    formats.nextWeek = `[Next] ${formats.lastWeek}`;
  }

  formats.sameElse = function(date) {
    return getDateFormatter(options.seconds, this.year() !== moment(date).year());
  };

  if (!options.capitalized) {
    Object.keys(formats).forEach((calendarString) => {
      if ((typeof formats[calendarString]) === 'string') {
        formats[calendarString] = formats[calendarString]
          .replace(/\[[^\]]+\]/g, (replacement) => replacement.toLowerCase())
          .replace('LT', timeFormat);
      }
    });
  } else {
    Object.keys(formats).forEach((calendarString) => {
      if ((typeof formats[calendarString]) === 'string') {
        formats[calendarString] = formats[calendarString]
          .replace('LT', timeFormat);
      }
    });
  }

  return moment(time).calendar(moment(), formats);
}

// gets an absolute date string, optionally with seconds
export function getDateString(date, withSeconds = false, withYear = true) {
  return moment(date).format(getDateFormatter(withSeconds, withYear));
}

export function getDuration(from, to = moment()) {
  if (to === undefined || from === undefined) {
    return moment.duration(0);
  }

  return moment.duration(moment(to).diff(from));
}

const LONG_DURATION_STRING = 'w [weeks], d [days], h [hours], m [minutes], s [seconds]';
const SHORT_DURATION_STRING = 'w[w] d[d] h[h] m[m] s[s]';

const DURATION_FORMATS = {
  full: [LONG_DURATION_STRING, { largest: 3, trim: false }],
  medium: [LONG_DURATION_STRING, { largest: 1, trim: false }],
  short: [SHORT_DURATION_STRING, { largest: 2, trim: false }],
  micro: [SHORT_DURATION_STRING, { largest: 1, trim: false }]
};

export function getDurationString(seconds, format = 'full') {
  if (getDurationString.formats.indexOf(format) === -1) {
    throw new Error(`getDurationString: Unknown format \`${format}\`.`);
  }

  const [template, options] = DURATION_FORMATS[format];

  return moment.duration(seconds, 'seconds').format(template, options);
}

getDurationString.formats = Object.keys(DURATION_FORMATS);
