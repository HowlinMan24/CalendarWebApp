import {CronJob} from "cron";
import sequelizeConnection from "./sequelize";
import {checkEventsOfAllCalendars} from "./utils/cronjobUtils";


sequelizeConnection.sync({force: false}).then(() => {
    console.log('Database synchronized');
}).catch((err) => {
    console.error('Error synchronizing database', err)
});

let job = new CronJob(
    `0 0 0 * * *`,
    async () => {
        await checkEventsOfAllCalendars();
    },
    null, true,
);
job.start();