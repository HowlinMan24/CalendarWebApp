import {HttpError} from "routing-controllers";

export class InvalidCredentialsError extends HttpError {
	constructor() {
		super(401, "Invalid username or password");
	}
}
