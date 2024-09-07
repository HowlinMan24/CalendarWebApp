import {HttpError} from "routing-controllers";

export class InvalidTokenError extends HttpError {
    constructor() {
        super(401, "Token does not exist");
    }
}