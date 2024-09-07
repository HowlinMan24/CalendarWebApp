require('dotenv').config(); //must be on top, above imported services

import {Sequelize} from "sequelize-typescript";
import Event from "./models/Event";
import Calendar from "./models/Calendar";
import User from "./models/User";

const config = require('config');
const dbConfig = config.get('db')

const sequelizeConnection = new Sequelize({
    dialect: dbConfig.get('dialect'),
    database: dbConfig.get('database'),
    host: dbConfig.get('host'),
    port: dbConfig.get('port'),
    username: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    models: [Event, Calendar, User],
    dialectOptions: {
        connectTimeout: 15000
    },
    pool: {
        max: 30,
        min: 0,
        idle: 200000,
        // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
        acquire: 30000,
    },
    query: {
        logging: false,
    },
    logging: false,
});
export default sequelizeConnection;
