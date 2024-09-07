import {mailerQueue} from "../redis/bullMQ/Queue";
import User from "../sequelize/models/User";
import Calendar from "../sequelize/models/Calendar";
import Event from "../sequelize/models/Event";
import moment from "moment";

export async function checkEventsOfAllCalendars() {
    let calendars = await Calendar.findAll({
        include: [User,Event]
    });
    let currentDate = moment().format('DD-MM-YYYY');
    for(let calendar of calendars) {
        let events = calendar.events;
        for (let event of events) {
            if (moment(event.date).format('DD-MM-YYYY') == currentDate) await sendMailToUser(calendar.user, calendar);
        }
    }
}

async function sendMailToUser(user: User, calendar: Calendar){
    await mailerQueue.add('send-mail',{
        to: user.email,
        subject: 'Event Scheduled',
        text: 'You have an event scheduled named event',
        html: `<p>You have an event scheduled for today named "eventName" from the ${calendar.name} calendar</p>`
    });
}
