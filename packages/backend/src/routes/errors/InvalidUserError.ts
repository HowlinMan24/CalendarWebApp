import {HttpError} from "routing-controllers";

export class InvalidUserError extends HttpError {
    constructor() {
        super(401,"User does not exist");
    }
}