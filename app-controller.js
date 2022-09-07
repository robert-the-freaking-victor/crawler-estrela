import dotenv from 'dotenv';
import EstrelaCrawlerFactory from './src/factories/estrela-crawler-factory.js';
import Log4js from './src/libs/log4js.js';
dotenv.config({
	path: './env/.env' 
});
const appLogger = Log4js.getLoggerInfo('AppController');

class AppControler {
	static async main() {
		const estrelaCrawler = await EstrelaCrawlerFactory.create(30000, true, true);
		await estrelaCrawler.openNewPage();
		await estrelaCrawler.goTo('https://estrelabet.com/ptb/bet/fixture-detail/soccer/brazil/brasileiro-serie-b-2022');
		const matches = await estrelaCrawler.findMatches();
		const match = matches.find(match => match.TeamHome === 'Cruzeiro MG' || match.TeamAway === 'Cruzeiro MG');
		if (match) {
			appLogger.info(`O próximo jogo do Cruzeiro será ${match.MatchDate}`);
			appLogger.info(match);
		} else {
			appLogger.info('Jogo do Cruzeiro não foi encontrado.');
		}
	}
}

export default AppControler;
