import {Worker} from "bullmq";
import {mailTransporter} from "./MailTransporter";
import {connection} from "./BullMQ";
import {factory} from "../../utils/ConfigLog4j";

const config = require('config');
const mailConfig = config.get('mail')

let errorLogged = false;

const logger = factory.getLogger('Worker.ts');

const emailWorker = new Worker('mailerQueue', async job => {
    const {to, subject, text, html} = job.data;
    await mailTransporter.sendMail({
        from: mailConfig.get('from'),
        to,
        subject,
        text,
        html
    })
}, {connection})

emailWorker.on('completed', job => {
    logger.debug(`The job with id ${job.id} has been completed!`)
})

emailWorker.on('error', error => {
    if (!errorLogged) {
        logger.error(`unexpected error thrown by the email worker`, error);
    }
    errorLogged = true;
});

emailWorker.on('failed', (job, error) => {
        logger.error(`The job with id ${job!.id} has not completed`, error)
    }
)

logger.info('BullMQ email worker started')

export {emailWorker};