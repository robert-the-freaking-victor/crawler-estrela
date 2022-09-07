import Log4js from '../libs/log4js.js';

class Crawler {
	currentPage;
	currentIndex;
	browser;
	logger;
	msTimeout;

	/**
	 * Constructor function
	 * @param {number} msTimeout default timeout in ms
	 */
	constructor(msTimeout) {
		this.pages = [];
		this.logger = Log4js.getLoggerInfo('Estrela Crawler');
		this.msTimeout = msTimeout;
	}

	/**
	 * Open a new page, add to list of pages, set the current page to the new page
	 */
	async openNewPage() {
		try {
			const page = await this.browser.newPage();
			await page.setExtraHTTPHeaders({
				'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
			});
			await page.evaluateOnNewDocument(() => {
				Object.defineProperty(navigator, 'platform', {
					get: () => 'Win32' 
				});
				Object.defineProperty(navigator, 'productSub', {
					get: () => '20100101' 
				});
				Object.defineProperty(navigator, 'vendor', {
					get: () => '' 
				});
				Object.defineProperty(navigator, 'oscpu', {
					get: () => 'Windows NT 10.0; Win64; x64' 
				});
			});
			this.currentPage = page;
			this.logger.info('Page opened with success.');
		} catch(err) {
			this.logger.error(err);
			throw {
				statusCode: 400,
				message: err.message ?? 'Fail to open a new page.'
			};
		}
	}

	/**
	 * Go to the desired url
	 * @param {string} url url to crawler access
	 */
	async goTo(url) {
		try {
			await this.currentPage.goto(url, {
				waitUntil: 'networkidle0'
			});
			this.logger.info(`${url} is loaded.`);
		} catch(err) {
			this.logger.error(err);
			throw {
				statusCode: 400,
				message: err.message ?? `Fail go to ${url}`
			};
		}
	}
}

export default Crawler;
