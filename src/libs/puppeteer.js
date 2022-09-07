import pupeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

pupeteer.use(StealthPlugin());

const pupeteerStealth = pupeteer;

export {
	pupeteerStealth,
	pupeteer
};
