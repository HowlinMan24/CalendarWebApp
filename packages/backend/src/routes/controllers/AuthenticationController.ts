import {Body, JsonController, Post} from "routing-controllers";
import {LoginBody, LoginResponse} from "calendar-shared/src/api/authentication-controller-types";
import User from "../../sequelize/models/User";
import {comparePassword, createToken} from "../../utils/jwtUtils";
import {InvalidCredentialsError} from "../errors/InvalidCredentialsError";

@JsonController("/api/auth")
export class AuthenticationController {

    @Post('/login')
    async login(@Body({required: true}) body: LoginBody) {
        const user = await User.findOne({where: {email: body.email}});
        if (!user) {
            throw new InvalidCredentialsError();
        }
        const isPasswordValid = await comparePassword(body.password, user.password);
        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }
        const token = createToken(user)
        return {
            token: token
        } as LoginResponse
    }

}
