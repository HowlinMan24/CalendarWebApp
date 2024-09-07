import * as bodyParser from 'body-parser';
import morgan from "morgan";
import moment from "moment";
import sequelizeConnection from "./sequelize";
import {factory} from "./utils/ConfigLog4j";
import {Express, Request, Response} from "express";
import {Action, createExpressServer, UnauthorizedError} from 'routing-controllers';
import {getParsedAuthorizationHeader} from "./utils/jwtUtils";
import User from "./sequelize/models/User";
import 'reflect-metadata';

const config = require('config');
const logger = factory.getLogger('server.ts');
const kibanaLogs = config.get('formatLogsForKibana')

//Start the worker
import './redis/bullMQ/Worker';

const app: Express = createExpressServer({
    cors: true,
    controllers: [__dirname + "/routes/controllers/*.ts"],
    middlewares: [__dirname + "/routes/middlewares/*.ts"],
    interceptors: [__dirname + "/routes/interceptors/*.ts"],

    authorizationChecker: async (action: Action, roles: string[]) => {
        try {
            let parsedToken = await getParsedAuthorizationHeader(action.request.header("Authorization"));
            if (!parsedToken) {
                return false;
            }
            const user = await User.findOne({
                where: {
                    id: parsedToken.id
                }
            });
            action.request.user = user;
            return user != null;
        } catch (e: any) {
            logger.error("Failed to validateToken", e);
            return false;
        }
    },
    currentUserChecker: async (action: Action) => {
        let parsedToken = await getParsedAuthorizationHeader(action.request.header("Authorization"));
        if (!parsedToken) {
            throw new UnauthorizedError();
        }
        return User.findOne({
            where: {
                id: parsedToken.id
            }
        });
    },

    classTransformer: true,
    validation: true,
    defaultErrorHandler: false,
});

const removeCredentials = (data: any) => {
    if (data.password) {
        data.password = '********'
    }
    if (data.shared_secret) {
        data.shared_secret = '****************'
    }
    return data;
}

app.use(morgan((tokens, req, res) => {
    let user = (req as any).user;
    if (kibanaLogs) {
        let reqBody = removeCredentials(req.body);
        let reqBodyString = JSON.stringify(reqBody);
        if (reqBodyString.length > 10000) {
            reqBodyString = reqBodyString.substring(0, 10000) + " ...";
        }
        return JSON.stringify({
            "level": "INFO",
            "source": "HTTP",
            "time": new Date().toUTCString(),
            "message": `${tokens['status'](req, res)} ${tokens['method'](req, res)} ${req.originalUrl}`,
            "reqBody": reqBodyString,
            "status": tokens['status'](req, res),
            "method": tokens['method'](req, res),
            "content_length": tokens['res'](req, res, 'content-length'),
            "uri": req.originalUrl,
            "user": user?.email,
        })
    } else {
        return `${moment().format('YYYY-MM-DD HH:mm:ss,SSS')} INFO [HTTP] ${tokens['status'](req, res)} ${tokens['method'](req, res)} ${req.originalUrl}`;
    }
}));

app.use(bodyParser.json());

sequelizeConnection.authenticate().then(() => {
    logger.debug('Sequelize connection has been established successfully.')
}).catch((error) => {
    logger.error("Unable to connect to the database:", error)
})

sequelizeConnection.sync({force: false}).then(() => {
    logger.info('Database synchronized');
}).catch((err) => {
    logger.error('Error synchronizing database', err)
})

app.get('/api/protected', (req: Request, res: Response) => {
    res.send('This is a protected route');
});

app.get('/', (req: Request, res: Response) => {
    res.send("Hello world!");
})

app.listen(process.env["PORT"], () => {
    logger.info(`Server is running on http://localhost:${process.env["PORT"]}`);
})
