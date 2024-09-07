import {Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post} from "routing-controllers";
import Calendar from "../../sequelize/models/Calendar";
import Event from "../../sequelize/models/Event";
import {IEvent} from "calendar-shared/src/db-models/IEvent";
import {ICalendar} from "calendar-shared/src/db-models/ICalendar";
import User from "../../sequelize/models/User";
import {CalendarNotExistingError} from "../errors/CalendarNotExistingError";

@Authorized()
@JsonController("/api/calendars")
export class CalendarController {


    @Authorized()
    @Get('/')
    async getAllCalendars(@CurrentUser() currentUser: User) {
        let results = await Calendar.findAll({where: {userId: currentUser.id}, raw: true});
        if (!results) {
            throw new CalendarNotExistingError();
        } else {
            return results;
        }
    }

    @Post('/')
    async createCalendar(@CurrentUser() currentUser: User, @Body() body: ICalendar) {
        body.userId = currentUser.id;
        body.identifier = await this.generateRandomToken();
        let calendar = await Calendar.create(body)
        return calendar.dataValues;
    }

    @Delete('/:id')
    async deleteCalendar(@CurrentUser() currentUser: User, @Param('id') id: number) {
        let result = await this.findCalendarOwnedByUser(id, currentUser)
        if (!result) {
            throw new CalendarNotExistingError();
        } else {
            return result.destroy();
        }
    }

    @Get('/:id')
    async getCalendarById(@CurrentUser() currentUser: User, @Param('id') id: number) {
        let result = await this.findCalendarOwnedByUser(id, currentUser)
        if (!result) {
            throw new CalendarNotExistingError();
        } else {
            return result.dataValues;
        }
    }

    @Get('/:id/events')
    async getEventsForCalendar(@Param('id') id: number, @CurrentUser() currentUser: User) {
        let calendar = await this.findCalendarOwnedByUser(id, currentUser)
        if (!calendar) {
            throw new CalendarNotExistingError();
        }
        return Event.findAll({where: {calendarId: id}, raw: true})
    }

    @Post('/:calendarId/events')
    async createEvent(@Param('calendarId') calendarId: number, @Body() body: IEvent, @CurrentUser() currentUser: User) {
        let result = await this.findCalendarOwnedByUser(calendarId, currentUser)
        if (!result) {
            throw new CalendarNotExistingError();
        } else {
            body.calendarId = calendarId;
            let result = await Event.create(body);
            return result.dataValues;
        }
    }

    @Get('/:calendarId/events/ics')
    async getEventsForCalendarICSFile(@Param('calendarId') calendarId: number, @CurrentUser() currentUser: User) {
        let result = await this.findCalendarOwnedByUser(calendarId, currentUser)
        if (!result) {
            throw new CalendarNotExistingError();
        } else {
            let result = await Event.findAll({where: {calendarId: calendarId}, raw: true})
            if (result)
                return result;
            else
                throw new CalendarNotExistingError();
        }
    }

    private async findCalendarOwnedByUser(calendarId: number, currentUser: User) {
        return await Calendar.findOne({
            where: {
                id: calendarId,
                userId: currentUser.id
            }
        })
    }

    private async generateRandomToken() {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
