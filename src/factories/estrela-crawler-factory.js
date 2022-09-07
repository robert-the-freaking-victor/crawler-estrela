import UserAgent from 'user-agents';
import EstrelaCrawler from '../crawler/estrela-crawler.js';
import { pupeteer, pupeteerStealth } from '../libs/puppeteer.js';

class EstrelaCrawlerFactory {

	/**
	 * 
	 * @param {number} msTimeout default timeout in ms
	 * @param {boolean} headlessBool headless option. true to hide navigator, false to show navigator
	 * @param {boolean} useStealth stealh mode to go further sites that have protections against web scrap
	 * @returns {Promise<EstrelaCrawler>}
	 */
	static async create(msTimeout, headlessBool, useStealth) {
		const randomUserAgent = new UserAgent({ 
			deviceCategory: 'desktop',
			platform: 'Linux x86_64',
		});
		const launchParams = {
			headless: headlessBool,
			args: [
				'--no-sandbox',
				// proxyString,
				'--start-maximized',
				'--disabled-setupid-sandbox',
				`--user-agent=${randomUserAgent.toString()}`
			],
			ignoreHTTPSErrors: true,
			defaultViewport: null,
		};
		const browser = useStealth 
			? await pupeteerStealth.launch(launchParams)
			: await pupeteer.launch(launchParams);
		const estrelaCrawler = new EstrelaCrawler(msTimeout);
		estrelaCrawler.browser = browser;
		return estrelaCrawler;
	}

}

export default EstrelaCrawlerFactory;
