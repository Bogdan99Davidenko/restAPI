const { google } = require('googleapis');
const privatekey = require('./calendar-api.json');


const auth = new google.auth.GoogleAuth({
  credentials: privatekey,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});
google.options({ auth });


async function getBusyTimes(calendarId, startTime, endTime) {
  const calendar = google.calendar('v3');
  const busyTimes = await calendar.freebusy.query({
    resource: {
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      timeZone: 'UTC',
      items: [{ id: calendarId }],
    },
  });
  return busyTimes.data.calendars[calendarId].busy;
}


async function addBusyEvents(calendarId, busyIntervals) {
  const calendar = google.calendar('v3');
  for (const interval of busyIntervals) {
    const event = {
      summary: 'Busy',
      start: {
        dateTime: interval.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: interval.end,
        timeZone: 'UTC',
      },
      status: 'busy',
    };
    await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
    });
  }
}


/* The email address of the calendar you want to access. */
const calendarId = 'bohdan.davydenko05@gmail.com';
// const calendarId = 'Mackarick.jana24@gmail.com';
const startTime = new Date('2023-01-18T09:00:00Z');
const endTime = new Date('2023-03-18T18:00:00Z'); 

getBusyTimes(calendarId, startTime, endTime)
  .then(busyIntervals => {
    console.log('Busy intervals:', busyIntervals);
  })
  .catch(err => {
    console.error('Error:', err);
});

