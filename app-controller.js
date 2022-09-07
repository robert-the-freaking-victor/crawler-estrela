import dotenv from 'dotenv';
import EstrelaCrawlerFactory from './src/factories/estrela-crawler-factory.js';
dotenv.config({
	path: './env/.env' 
});


class AppControler {
	static async main() {
		const estrelaCrawler = await EstrelaCrawlerFactory.create(30000, true, true);
		await estrelaCrawler.openNewPage();
		await estrelaCrawler.goTo('https://estrelabet.com/ptb/bet/fixture-detail/soccer/brazil/brasileiro-serie-b-2022');
		const matches = await estrelaCrawler.findMatches();
		console.log(matches);
	}
}

export default AppControler;
