import {Queue} from "bullmq";
import {connection} from "./BullMQ";

const mailerQueue = new Queue('mailerQueue', {connection})

export {mailerQueue};