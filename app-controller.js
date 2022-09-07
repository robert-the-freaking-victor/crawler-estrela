import dotenv from 'dotenv';
import EstrelaCrawlerFactory from './src/factories/estrela-crawler-factory.js';
dotenv.config({
	path: './env/.env' 
});


class AppControler {
	static async main() {
		const estrelaCrawler = await EstrelaCrawlerFactory.create(30000, false, true);
		await estrelaCrawler.openNewPage();
		await estrelaCrawler.goTo('https://estrelabet.com/ptb/bet/fixture-detail/soccer/brazil/brasileiro-serie-b-2022');
		await estrelaCrawler.findMatches();
		// const { CRON_DESCRIPTOR } = process.env;
		// await Crawler.setup();
		// const crawlerJob = new CronJob(CRON_DESCRIPTOR, Crawler.runCrawler);
		// crawlerJob.start();
		// Crawler.runCrawler();
		// logger.info('Crawler started');
	}
}

export default AppControler;
