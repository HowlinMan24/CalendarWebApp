import {
    AbstractLogger,
    LFService,
    LogFormat,
    LoggerFactoryOptions,
    LoggerType,
    LogGroupRule,
    LogLevel,
    LogMessage
} from "typescript-logging";
import {LogGroupRuntimeSettings} from "typescript-logging/dist/commonjs/log/standard/LogGroupRuntimeSettings";

class CustomLogger extends AbstractLogger {

    constructor(name: string, settings: LogGroupRuntimeSettings) {
        super(name, settings);
    }

    protected doLog(msg: LogMessage): void {
        let message = msg.logData ? msg.logData.msg : msg.message;
        let data = msg.logData ? JSON.stringify(msg.logData.data) : undefined;
        let json = {
            "level": LogLevel[msg.level].toUpperCase(),
            "source": msg.loggerName,
            "time": msg.date.toUTCString(),
            "message": message,
            "error": msg.errorAsStack || undefined,
            "data": data
        };
        console.log(JSON.stringify(json));
    }

}

const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Debug));

const customLoggerOptions = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Debug, new LogFormat(), LoggerType.Custom,
        (name: string, logGroupRuntimeSettings: LogGroupRuntimeSettings) => new CustomLogger(name, logGroupRuntimeSettings)
    ));

const config = require('config');
const formatLogsForKibana = config.get('formatLogsForKibana');
export const factory = formatLogsForKibana ? LFService.createNamedLoggerFactory("CustomLoggerOptions", customLoggerOptions) : LFService.createNamedLoggerFactory("LoggerFactory", options);
