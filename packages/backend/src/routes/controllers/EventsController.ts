import {Authorized, CurrentUser, Delete, JsonController, Param, Post} from "routing-controllers";
import Event from "../../sequelize/models/Event";
import User from "../../sequelize/models/User";
import Calendar from "../../sequelize/models/Calendar";
import {EventNotExistingError} from "../errors/EventNotExistingError";
import {EventAttributes} from "ics";
import moment from "moment";
import {InvalidUserError} from "../errors/InvalidUserError";

const ics = require('ics');

@Authorized()
@JsonController("/api/events")
export class EventsController {

    @Delete('/:id')
    async deleteEvent(@Param('id') id: number, @CurrentUser() currentUser: User) {
        let event = await Event.findOne({
            include: {
                model: Calendar,
                where: {
                    userId: currentUser.id
                }
            }
        })
        if (!event) {
            throw new EventNotExistingError();
        }
        return Event.destroy({
            where: {
                id: event.id
            }
        })
    }

    @Post('/:id/export-all-to-ics')
    async exportAllToICS(@Param('id') id: number, @CurrentUser() currentUser: User) {
        let calendar = await Calendar.findOne({

            where: {
                id: id,
                userId: currentUser.id
            }
        });

        if (!calendar) {
            throw new InvalidUserError();
        }

        return await new Promise(async (resolve, reject) => {
            let events = await Event.findAll({where: {calendarId: id}, raw: true})
            if (!events || !events.length) {
                reject("Invalid event data");
                return;
            }
            let eventsForICS: EventAttributes[] = [];
            events.forEach(event => {
                let date = moment(event.date);

                eventsForICS.push({
                    title: `random title `, // TODO Impement titles
                    description: `sample description`, // TODO Implement description
                    busyStatus: 'FREE', // TODO implement busyStatus
                    start: [
                        date.year(),
                        date.month() + 1,
                        date.date(),
                        0, 0 // if in the future hour and minute is implemented, use: date.hour(), date.minute()
                    ],
                    duration: {days: 1}
                });
            });

            ics.createEvents(eventsForICS, (error: any, value: any) => {
                if (error) {
                    console.log(error);
                    reject(`There was an error while exporting the events to .ics file.`);
                    // TODO Create Error in the 'errors' folder for the "routing-controllers"
                }
                resolve({
                    data: value
                });
            });
        })
    }
}
