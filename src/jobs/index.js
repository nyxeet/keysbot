import { CronJob } from "cron";
import { DateTime } from "luxon";

const job = new CronJob(
  "*/10 * * * * *",
  () => {
    console.log("Every second:", DateTime.now().toISO());
  },
  null,
  false,
  "Europe/Kiev"
);

const jobThursday = new CronJob(
  "0 18 * * 4",
  () => {
    console.log("Every Thursday at 18:00:", DateTime.now().toISO());
  },
  null,
  false,
  "Europe/Kiev"
);

const jobHourly = new CronJob(
  "0 * * * *",
  () => {
    console.log("Every hour:", DateTime.now().toISO());
  },
  null,
  false,
  "Europe/Kiev"
);

export const registerJobs = () => {
  job.start();
  // jobThursday.start();
  // jobHourly.start();
};
