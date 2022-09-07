import log4js from 'log4js';

class Log4js {

	/**
	 * Get an instance of logger
	 * @param {string} loggerName 
	 * @returns
	 */
	static getLoggerInfo(loggerName) {
		const logger = log4js.getLogger(loggerName);
		logger.level = 'info';
		return logger;
	}
	
}

export default Log4js;
