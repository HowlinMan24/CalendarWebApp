import {HttpError} from "routing-controllers";

export class CalendarNotExistingError extends HttpError {
    constructor() {
        super(404, "the calendar does not exist");
    }
}