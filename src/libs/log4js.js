import log4js from 'log4js';

class Log4js {

	static getLoggerInfo(loggerName) {
		const logger = log4js.getLogger(loggerName);
		logger.level = 'info';
		return logger;
	}
	
}

export default Log4js;
