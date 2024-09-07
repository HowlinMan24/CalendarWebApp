import {Get, JsonController, Param} from "routing-controllers";
import {CalendarNotExistingError} from "../errors/CalendarNotExistingError";
import Event from "../../sequelize/models/Event";
import Calendar from "../../sequelize/models/Calendar";

@JsonController('/api/calendar-shared')
export class CalendarSharedController {

    @Get('/:calendarToken')
    async getSharedCalendarById(@Param('calendarToken') token: string) {
        if (!token)
            throw new CalendarNotExistingError();
        return await Calendar.findOne({where: {identifier: token}, raw: true});
    }

    @Get('/:calendarToken/events')
    async getSharedCalendarEvents(@Param('calendarToken') token: string) {
        if (!token)
            throw new CalendarNotExistingError();
        const calendar = await Calendar.findOne({where: {identifier: token}});
        if (!calendar)
            throw new CalendarNotExistingError();
        return Event.findAll({where: {calendarId: calendar.id}, raw: true})
    }
}