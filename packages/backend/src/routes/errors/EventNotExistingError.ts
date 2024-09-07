import {HttpError} from "routing-controllers";

export class EventNotExistingError extends HttpError {
    constructor() {
        super(404, "the event does not exist");
    }
}
