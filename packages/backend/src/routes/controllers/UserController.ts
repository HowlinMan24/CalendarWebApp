import {Authorized, Body, Get, JsonController, Param, Post, Req} from "routing-controllers";
import User from "../../sequelize/models/User";
import {createToken, getParsedToken} from "../../utils/jwtUtils";
import {mailerQueue} from "../../redis/bullMQ/Queue";
import {IUser} from "calendar-shared/src/db-models/IUser";
import {InvalidUserError} from "../errors/InvalidUserError";
import bcrypt from "bcryptjs";
import {InvalidTokenError} from "../errors/InvalidTokenError";

@JsonController("/api/user")
export class UserController {
    @Authorized()
    @Get('/')
    async getAll(@Req() request: Request) {
        return User.findAll({raw: true});
    }

    @Post('/')
    async createUser(@Body() body: IUser) {
        body.password = await bcrypt.hash(body.password, 10);
        const user = await User.create(body)
        const activationToken = createToken(user);
        await mailerQueue.add('send-mail', {
            to: body.email,
            subject: 'Email Confirmation',
            text: `Please confirm your email by clicking the following link: http://localhost:3500/api/user/confirm/${activationToken}`,
            html: `<p>Please confirm your email by clicking the following link: <a href="http://localhost:3500/api/user/confirm/${activationToken}">Confirm Email</a></p>`
        })
        return user.dataValues;
    }

    @Get('/confirm/:token')
    async confirmEmail(@Param('token') token: string) {
        const decodedToken = await getParsedToken(token)
        if (!decodedToken) {
            throw new InvalidTokenError();
        }
        const user = await User.findByPk(decodedToken.id)
        if (!user) {
            throw new InvalidUserError();
        }
        user.isActivated = true;
        await user.save();
        return {message: 'user has been confirmed'};
    }

}
