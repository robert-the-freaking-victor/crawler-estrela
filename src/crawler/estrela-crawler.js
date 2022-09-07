// import Log4js from '../libs/log4js.js';
// import { NormalizeBetFisher, Normalize, DateAux } from 'betfisher-utils';
// import NormalizeNsx from '../utils/normalize-nsx.js';
// import ConfigCrawlerClientService from '../services/config-crawler-client-service.js';
// import MatchInsertClientService from '../services/match-insert-client-service.js';
// import Monitoring from '../utils/monitoring.js';

import Normalize from '../utils/normalize.js';
import Crawler from './crawler.js';

// class NsxCrawler {

// 	nsxLogger;
// 	pages;
// 	currentPage;
// 	browser;

// 	constructor() {
// 		this.nsxLogger = Log4js.getLoggerInfo('NSX Crawler');
// 	}

// 	async openNewPage() {
// 		const page = await this.browser.newPage();
// 		await page.setExtraHTTPHeaders({
// 			'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
// 		});
// 		await page.evaluateOnNewDocument(() => {
// 			Object.defineProperty(navigator, 'platform', {
// 				get: () => 'Win32' 
// 			});
// 			Object.defineProperty(navigator, 'productSub', {
// 				get: () => '20100101' 
// 			});
// 			Object.defineProperty(navigator, 'vendor', {
// 				get: () => '' 
// 			});
// 			Object.defineProperty(navigator, 'oscpu', {
// 				get: () => 'Windows NT 10.0; Win64; x64' 
// 			});
// 		});
// 		this.pages.push(page);
// 		this.currentPage = page;
// 	}

// 	async collectMatchesFromLeagueFromBethouse(league, bethouse, clubs) {
// 		try {
// 			const stealthHouses = process.env.STEALTH_HOUSES.split(';');
// 			this.nsxLogger.info(`Step 1/5: Collecting data from ${bethouse.Name} in league ${league.Name}.`);
// 			const url = `${bethouse.BaseUrl}/${league.NsxUrlComplement}`;
// 			const headlessBool = process.env.HEADLESS_BOOL == 'true' ? true : false;
// 			const useStealth = stealthHouses.includes(bethouse.Name);
// 			const matchesCollected = await this.collectFromUrl(url, headlessBool, useStealth, clubs);
// 			const matchesFromBethouse = matchesCollected.map((match) => {
// 				const { TeamHome, TeamAway, MatchDate } = match;
// 				match.LeagueName = league.Name;
// 				const matchIdentifier = NormalizeBetFisher.buildMatchIdentifier(TeamHome.Name, TeamAway.Name, MatchDate, league.Name);
// 				match.MatchIdentifier = matchIdentifier;
// 				match.Status = league.IsCollectible ? 'TO_COLLECT' : 'UNCOLLECTIBLE';
// 				const { Market } = match;
// 				Market.BethouseName = bethouse.Name;
// 				Market.AfiliatedLink = bethouse.AfiliatedLink;
// 				// delete match.Market;
// 				return match;
// 			});
// 			this.nsxLogger.info(`Matches from ${bethouse.Name} on ${league.Name} were successfully collected.`);
// 			return matchesFromBethouse;
// 		} catch(err) {
// 			this.nsxLogger.error(err);
// 			return [];
// 		}
// 	}

// 	async runCrawler() {
// 		// toDo: get the leagues with filter IsActive on the request
// 		const leagues = await ConfigCrawlerClientService.findLeagues({
// 			IsActive: true
// 		});
// 		const bethouses = await ConfigCrawlerClientService.findBethouses({
// 			Type: process.env.BETHOUSE_TYPE
// 		});
// 		const clubs = await ConfigCrawlerClientService.findClubs({
// 		});
// 		const leaguesPromises = leagues.reduce(async (previousLeague, currentLeague) => {
// 			await previousLeague;
// 			const matches = [];
// 			const bethousesPromises = bethouses.reduce(async (previousBethouse, currentBethouse) => {
// 				await previousBethouse;
// 				try {
// 					const matchesFromBethouse = await this.collectMatchesFromLeagueFromBethouse(currentLeague, currentBethouse, clubs);
// 					matches.push(matchesFromBethouse);
// 				} catch (err) {
// 					this.nsxLogger.error(err);
// 				}
// 			}, Promise.resolve([]));
// 			await Promise.resolve(bethousesPromises);
// 			const formatedMatches = matches.reduce((prev, bethouseMatches) => {
// 				bethouseMatches.forEach(match => {
// 					try {
// 						const { Market, ...currentMatch } = match;
// 						let matchIndex = prev.findIndex(matchItem => matchItem.MatchIdentifier === currentMatch.MatchIdentifier);
// 						if (matchIndex === -1) {
// 							matchIndex = prev.push({
// 								Markets: [],
// 								...currentMatch 
// 							});
// 							matchIndex--;
// 						}
// 						prev[matchIndex].Markets.push(Market);
// 					} catch (err) {
// 						this.nsxLogger.error(err);
// 					}
// 				});
// 				return prev;
// 			}, []);
// 			const results = await MatchInsertClientService.updateManyByMatchIdentifier(formatedMatches);
// 			this.nsxLogger.info(results);
// 		}, Promise.resolve([]));
// 		await Promise.resolve(leaguesPromises);
// 	}

// 	async collectFromUrl(url, headlessBool = true, useStealth = false, clubs) {
// 		// const launchParams = {
// 		// 	headless: headlessBool,
// 		// 	args: [
// 		// 		'--no-sandbox',
// 		// 		// proxyString,
// 		// 		'--start-maximized',
// 		// 		'--disabled-setupid-sandbox',
// 		// 		'--user-agent=Mozilla/5.0 (Windows NT 10.0); WOW64; Trident/7.0; rv:11.0) like Gecko'
// 		// 	],
// 		// 	ignoreHTTPSErrors: true,
// 		// 	defaultViewport: null,
// 		// 	timeout: parseInt(process.env.CRAWLERS_TIMEOUT, 10)
// 		// };
// 		// const browser = useStealth 
// 		// 	? await pupeteerStealth.launch(launchParams)
// 		// 	: await pupeteer.launch(launchParams);
// 		this.nsxLogger.info(`Step 2/5: Opening browser with stealth mode ${useStealth}`);
// 		let matches = [];
// 		try {
// 			// const page = await browser.newPage();
// 			// await page.setExtraHTTPHeaders({
// 			// 	'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
// 			// });
// 			// await page.evaluateOnNewDocument(() => {
// 			// 	Object.defineProperty(navigator, 'platform', {
// 			// 		get: () => 'Win32' 
// 			// 	});
// 			// 	Object.defineProperty(navigator, 'productSub', {
// 			// 		get: () => '20100101' 
// 			// 	});
// 			// 	Object.defineProperty(navigator, 'vendor', {
// 			// 		get: () => '' 
// 			// 	});
// 			// 	Object.defineProperty(navigator, 'oscpu', {
// 			// 		get: () => 'Windows NT 10.0; Win64; x64' 
// 			// 	});
// 			// });
// 			// await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
// 			await page?.goto(url, {
// 				waitUntil: 'networkidle0',
// 			});
// 			await page.reload({
// 				waitUntil: ['networkidle0']
// 			});
// 			const closeItem = await page.$('.fa-times-circle');
// 			if(closeItem) {
// 				closeItem.click();
// 			}
// 			let matchsHtmlElements = await page.$$('.grow');
// 			if(matchsHtmlElements) {
// 				await page.reload({
// 					waitUntil: ['networkidle0'] 
// 				});
// 				matchsHtmlElements = await page.$$('.grow');
// 			}
// 			if(matchsHtmlElements.length === 0) {
// 				throw {
// 					statusCode: 400,
// 					message: 'No matches were found.'
// 				};
// 			}
// 			matches = matchsHtmlElements.reduce(async (previous, _current, index) => {
// 				try {
// 					const resolvedPrevious = await previous;
// 					const start = new Date().getTime();
// 					const match = await this.collectMatch(page, index, clubs, 3);
// 					if (match) {
// 						resolvedPrevious.push(match);
// 					}
// 					const end = new Date().getTime();
// 					return Promise.resolve(resolvedPrevious);
// 				} catch (err) {
// 					this.nsxLogger.error(err);
// 				}
// 			}, Promise.resolve([]));
// 			matches = await Promise.resolve(matches);
// 			await page.close();
// 			await browser.close();
// 			return matches;
// 		} catch (err) {
// 			this.nsxLogger.error(err);
// 			await browser.close();
// 			return matches;
// 		}
// 	}

// 	async backFromMatchToLeague(page) {
// 		try {
// 			await page.evaluate(() => {
// 				const backElement = document.querySelector('.fa-caret-left');
// 				backElement.click();
// 			});
// 		} catch(err) {
// 			this.nsxLogger.error(err);
// 		}
// 	}

// 	async collectMatch(page, index, clubs, retries) {
// 		let matchClicked = false;
// 		try {
// 			await page.waitForSelector('#my-combo-markets');
// 			const matchs = await page.$$('.grow');
// 			await matchs[index].evaluate(m => {
// 				m.click();
// 			});
// 			matchClicked = true;
// 			await page.waitForSelector('.icon-ball');
// 			// get the club home x club Away
// 			const matchTeams = await page.$('.ml-0');
// 			const { teamHome, teamAway } = await this.processTeamsMatch(matchTeams, clubs);
// 			this.nsxLogger.info(`Step 3/5: Collecting ${teamHome}x${teamAway}`);
// 			// geting the label with date
// 			const matchDateElement = await page.$('.match-date');
// 			const matchDate = await NormalizeNsx.processMatchDate(matchDateElement);
// 			const match = {
// 				TeamHome: {
// 					Name: teamHome 
// 				},
// 				TeamAway: {
// 					Name: teamAway 
// 				},
// 				MatchDate: matchDate.toISOString(),
// 				Market: {
// 				}
// 			};
// 			const tabs = await page.$$('.tab');
// 			tabs.pop();
// 			const promiseTabs = tabs.reduce(async (previousTab, currentTab, indexTab) => {
// 				const labelsMarketCategory = [
// 					{
// 						toCollect: true,
// 						value: 'Main'
// 					},
// 					{
// 						toCollect: true,
// 						value: 'Handicap'
// 					},
// 					{
// 						toCollect: false,
// 						value: 'Goals'
// 					},
// 					{
// 						toCollect: false,
// 						value: '1st Time'
// 					},
// 					{
// 						toCollect: false,
// 						value: '2st Time'
// 					}
// 					,
// 					{
// 						toCollect: false,
// 						value: 'Corners'
// 					},
// 					{
// 						toCollect: false,
// 						value: 'Cards'
// 					},
// 					{
// 						toCollect: false,
// 						value: 'Player'
// 					},
// 					{
// 						toCollect: false,
// 						value: 'Minutes'
// 					},
// 					{
// 						toCollect: false,
// 						value: 'Special'
// 					}
// 				];
// 				await previousTab;
// 				if (labelsMarketCategory[indexTab].toCollect) {
// 					await currentTab.click();
// 					await page.waitForSelector('.icon-ball');
// 					const currentCategory = labelsMarketCategory[indexTab].value;
// 					this.nsxLogger.info(`Step 4/5: Collecting tab ${currentCategory}`);
// 					const market = await this.collectMarketBethouse(page, teamHome, teamAway, currentCategory);
// 					match.Market[currentCategory] = market;
// 				}
// 			}, Promise.resolve([]));
// 			await Promise.resolve(promiseTabs);
// 			await this.backFromMatchToLeague(page);
// 			this.nsxLogger.info(`Step 5/5: Successfuly collected match ${match.TeamHome.Name}x${match.TeamAway.Name}`);
// 			return match;
// 		} catch (err) {
// 			await Monitoring.sendErrorToS3(page);
// 			if(matchClicked) {
// 				await this.backFromMatchToLeague(page);
// 			}
// 			if(retries > 0) {
// 				return this.collectMatch(page, index, clubs, retries - 1);
// 			}
// 			return null;
// 		}
// 	}

// 	collectSimpleHandicap(handicapHome, handicapAway) {
// 		const finalOdds = [];
// 		handicapHome.pop();
// 		handicapAway.pop();

// 		const arrayLenght = handicapHome.length === handicapAway.length ? handicapHome.length : -1;

// 		if (arrayLenght === -1) {
// 			throw 'The data of Home have different size from Away. Please check if the HTML structure has changed.';
// 		} else {
// 			for (let i = 0; i < arrayLenght; i++) {
// 				const odd = {
// 				};
// 				const splitedValueHome = handicapHome[i].textContent.split(' ');
// 				const splitedValueAway = handicapAway[i].textContent.split(' ');
// 				if (splitedValueHome.length === 3 && splitedValueAway.length === 3) {
// 					const referenceValueHome = splitedValueHome[1];
// 					const referenceValueAway = splitedValueAway[1];
// 					odd.OddHome = parseFloat(splitedValueHome[splitedValueHome.length - 1]);
// 					odd.OddAway = parseFloat(splitedValueAway[splitedValueAway.length - 1]);
// 					odd.HomeHandicapValue = parseFloat(referenceValueHome);
// 					odd.AwayHandicapValue = parseFloat(referenceValueAway);
// 				} else {
// 					odd.OddHome = parseFloat(splitedValueHome[splitedValueHome.length - 1]);
// 					odd.OddAway = parseFloat(splitedValueAway[splitedValueAway.length - 1]);
// 					odd.HomeHandicapValue = parseFloat(`${splitedValueHome[1]}${splitedValueHome[2]}`);
// 					odd.AwayHandicapValue = parseFloat(`${splitedValueAway[1]}${splitedValueAway[2]}`);
// 				}
// 				finalOdds.push(odd);
// 			}
// 			return finalOdds;
// 		}
// 	}

// 	collectEuropeanHandicap(odds, labels, sumFactor) {
// 		const europeanHandicap = [];
// 		for (let i = sumFactor; i < odds.length; i += sumFactor) {
// 			const itemOdd = {
// 			};
// 			itemOdd.ReferenceValue = odds[i].trim();

// 			for (let j = 0; j < labels.length; j++) {
// 				itemOdd[`Odd${labels[j]}`] = parseFloat(odds[i + (j + 1)].trim());
// 			}

// 			europeanHandicap.push(itemOdd);
// 		}
// 		return europeanHandicap;
// 	}

// 	async processLabelsMarket(labelsMarket) {
// 		const textContentLabelsPromises = labelsMarket.map((labelMarket) => {
// 			return labelMarket.getProperty('textContent');
// 		});
// 		const textContentLabels = await Promise.all(textContentLabelsPromises);
// 		const jsonedLabelsPromises = textContentLabels.map((labelMarket) => {
// 			return labelMarket.jsonValue();
// 		});
// 		const jsonedLabels = await Promise.all(jsonedLabelsPromises);
// 		const processedLabels = jsonedLabels.map((labelMarket) => {
// 			return labelMarket.trim();
// 		});
// 		return processedLabels;
// 	}

// 	collectdSimpleOdd(odds, labels) {
// 		const itemOdd = {
// 		};
// 		odds.map((item, index) => {
// 			const splitedItem = item.split(' ');
// 			const oddNum = parseFloat(splitedItem.pop());
// 			itemOdd[`Odd${labels[index]}`] = oddNum;
// 			itemOdd[`Label${labels[index]}`] = splitedItem.join(' ');
// 			return oddNum;
// 		});
// 		return itemOdd;
// 	}

// 	collectTiePayBack(odds) {
// 		const splitedOddLeft = odds[0].split(' ');
// 		const splitedOddRight = odds[1].split(' ');
// 		const oddLeft = splitedOddLeft.pop();
// 		const oddRight = splitedOddRight.pop();
// 		const odd = {
// 			OddLeft: parseFloat(oddLeft),
// 			OddRight: parseFloat(oddRight),
// 			LabelLeft: splitedOddLeft.join(' '),
// 			LabelRight: splitedOddRight.join(' '),
// 		};
// 		return odd;
// 	}

// 	collectExactScore(odds, labels) {
// 		const formatedOdds = odds.reduce((prevOdd, currOdd, index) => {
// 			const splitedOdd = currOdd.split(' ');
// 			const firstLabel = splitedOdd.shift();
// 			const item = splitedOdd.reduce((prevSplitOdd, currSplitOdd) => {
// 				const splitItem = currSplitOdd.split(':');
// 				const currentLabel = prevSplitOdd.prevLabel;
// 				const currentOdd = splitItem[0].substring(0, splitItem[0].length - 1);
// 				const newItem = {
// 					Label: currentLabel,
// 					Value: +currentOdd
// 				};
// 				prevSplitOdd.data.push(newItem);
// 				const nextOdd =  `${Array.from(splitItem[0]).pop()}:${splitItem.pop()}`;
// 				prevSplitOdd.prevLabel = nextOdd;
// 				return prevSplitOdd;
// 			},
// 			{
// 				prevLabel: firstLabel,
// 				data: []
// 			});
// 			delete item.prevLabel;
// 			prevOdd[labels[index]] = item.data;
// 			return prevOdd;
// 		}, {
// 		});
// 		return formatedOdds;
// 	}

// 	collectBothScore(odds) {
// 		const bothScore = odds.map((odd) => {
// 			const splitedOdd = odd.split(' ');
// 			const result = {
// 			};
// 			const oddNum = splitedOdd.pop();
// 			result.Label = splitedOdd.join(' ');
// 			result.OddValue = parseFloat(oddNum);
// 			return result;
// 		});
// 		return bothScore;
// 	}

// 	async collectMainOdds(labelOdd, valueOdd, homeTeam, awayTeam) {
// 		const markets = {
// 		};
// 		let labels = [];
// 		let currentLabel;
// 		if (labelOdd === 'Resultado Final') {
// 			currentLabel = 'FinalResult';
// 		} else if (labelOdd === 'Último Gol') {
// 			currentLabel = 'LastGoal';
// 		} else if (labelOdd === 'Dupla Hipótese') {
// 			currentLabel = 'DoubleHypothesis';
// 		} else if (labelOdd === 'Empate Anula Aposta') {
// 			currentLabel === 'TieCancelBet';
// 		} else if (labelOdd === 'Placar Exato') {
// 			currentLabel = 'ExactlyResult';
// 		} else if (labelOdd.endsWith('Anula Aposta')) {
// 			const splited = labelOdd.split(' ');
// 			const currentTeam = `${splited[0]} ${splited[1]}`;
// 			if (currentTeam === homeTeam) {
// 				currentLabel = 'HomeCancelBet';
// 			} else if (currentTeam === awayTeam) {
// 				currentLabel = 'AwayCancelBet';
// 			} else {
// 				currentLabel = 'TieCancelBet';
// 			}
// 		}
// 		if (['Resultado Final', 'Último Gol', 'Dupla Hipótese',].includes(labelOdd)) {
// 			labels = ['Left', 'Middle', 'Right'];
// 			const odds = this.collectdSimpleOdd(valueOdd, labels);
// 			markets[currentLabel] = odds;
// 		} else if (labelOdd === 'Empate Anula Aposta' || labelOdd.endsWith('Anula Aposta')) {
// 			const labelOddSplited = labelOdd.split(' ');
// 			labelOddSplited.pop();
// 			labelOddSplited.pop();
// 			const odds = this.collectTiePayBack(valueOdd);
// 			markets[currentLabel] = odds;
// 		} else if (labelOdd === 'Placar Exato') {
// 			const labels = ['HomeWin', 'Tie', 'AwayWin'];
// 			const odds = this.collectExactScore(valueOdd, labels);
// 			markets[currentLabel] = odds;
// 		} else if (labelOdd === 'Para Ambos os Times Marcarem') {
// 			const odds = this.collectBothScore(valueOdd);
// 			markets[currentLabel] = odds;
// 		}
// 		return markets;
// 	}

// 	async collectHandicapOdds(labelOdd, valueOdd) {
// 		const markets = {
// 		};
// 		let labels = [];
// 		let currentLabel;
// 		if (labelOdd === 'Handicap Europeu') {
// 			currentLabel = 'EuropeanHandicap';
// 			labels = ['Left', 'Middle', 'Right'];
// 			const sumFactor = 4;
// 			const odds = this.collectEuropeanHandicap(valueOdd, labels, sumFactor);
// 			markets[currentLabel] = odds;
// 		} else if(labelOdd.endsWith('Handicap Europeu')) {
// 			const half = labelOdd.split('-').shift().trim();
// 			labels = ['Left', 'Middle', 'Right'];
// 			const halfFormated = half === '1º Tempo' ? 'FirstHalf' : 'SecondHalf';
// 			currentLabel = `${halfFormated}EuropeanHandicap`;
// 			const sumFactor = 4;
// 			const odds = this.collectEuropeanHandicap(valueOdd, labels, sumFactor);
// 			markets[currentLabel] = odds;
// 		} else if (labelOdd === 'Handicap') {
// 			const childrens = await valueOdd.evaluate((node) => node.children);
// 			const handicapHome = childrens[0];
// 			const handicapAway = childrens[1];
// 			const odds = this.collectSimpleHandicap(handicapHome, handicapAway);
// 			markets[labelOdd] = odds;
// 		}
// 		return markets;
// 	}

// 	async collectGoalsOdds(labelOdd, valueOdd) {
		
// 	}

// 	async collectMarketBethouse(page, homeTeam, awayTeam, currentTab) {
// 		const labelsMarket = await page.$$('.grow');
// 		labelsMarket.pop();
// 		const processedLabelsMarket = await this.processLabelsMarket(labelsMarket);
// 		const marketValues = await page.evaluate(async () => {
// 			const itemsArray = Array.from(document.querySelectorAll('.w-100'));
// 			const itemsWithValues = itemsArray.map((item) => {
// 				const children = Array.from(item.children);
// 				const values = children.map((child) => child.textContent);
// 				return values;
// 			});
// 			return itemsWithValues;
// 		});
// 		const crawledData = [];
// 		for (let i = 0; i < processedLabelsMarket.length; i++) {
// 			crawledData.push({
// 				labels: processedLabelsMarket[i],
// 				markets: marketValues[i]
// 			});
// 		}
// 		const collectPromises = crawledData.map((data) => {
// 			if (currentTab === 'Main') {
// 				return this.collectMainOdds(data.labels, data.markets, homeTeam, awayTeam);
// 			} else if (currentTab === 'Handicap') {
// 				return this.collectHandicapOdds(data.labels, data.markets);
// 			} else if(currentTab === 'Gols') {

// 			}
// 		});
// 		const allMarkets = await Promise.all(collectPromises);
// 		let markets = {
// 		};
// 		allMarkets.forEach((market) => {
// 			markets = Object.assign(markets, market);
// 		});
// 		return markets;
// 	}

// 	async processTeamsMatch(matchTeamsElement, clubs) {
// 		const matchTeamsString = await (await matchTeamsElement.getProperty('textContent')).jsonValue();
// 		const splitedTeams = matchTeamsString.split('x');
// 		const teamHome = splitedTeams[0].trimEnd().trimStart().toLowerCase();
// 		const teamAway = splitedTeams[1].trimEnd().trimStart().toLowerCase();
// 		const clubHome = clubs.find(club => club.AlternativeNames.includes(Normalize.removeSpecialCharacters(teamHome)));
// 		const clubAway = clubs.find(club => club.AlternativeNames.includes(Normalize.removeSpecialCharacters(teamAway)));
// 		this.validateClub(clubHome, 'Can\'t find home club');
// 		this.validateClub(clubAway, 'Can\'t find away club');
// 		return {
// 			teamHome: clubHome.Name,
// 			teamAway: clubAway.Name
// 		};
// 	}

// 	validateClub(club, message) {
// 		if (!club) {
// 			throw {
// 				statusCode: 400,
// 				message: message
// 			};
// 		}
// 	}

// }

// export default NsxCrawler;

class EstrelaCrawler extends Crawler {
	
	constructor(msTimeout) {
		super(msTimeout);
	}

	async getTeamNames() {
		const teamNames = await this.currentPage.evaluate(() => {
			const generalItems = Array.from(document.querySelectorAll('.element.flex-item.match'));
			const filteredItems = generalItems.filter(item => item.textContent.includes('star_border'));
			const teamNames = filteredItems.reduce((prev, curr) => {
				const teams = curr.textContent.split('star_border');
				console.log(teams);
				teams.shift();
				prev.push(teams[0].trim());
				prev.push(teams[1].trim());
				return prev;
			}, []);
			return teamNames;
		});
		return teamNames;
	}

	async findMatches() {
		const teamNamesElementHandle = await this.currentPage.$$('.team-name.truncate');
		const teamNamesPropertyPromise = teamNamesElementHandle.map(teamName => teamName.getProperty('textContent'));
		const teamNamesProperty = await Promise.all(teamNamesPropertyPromise);
		const teamNamesPromise = teamNamesProperty.map(teamName => teamName.jsonValue());
		const teamNames = await Promise.all(teamNamesPromise);
		// this filter is fragile
		// there should be a better way to make this
		const itemsToFilter = teamNames.reduce((prev, curr, index) => {
			if(!curr.includes('.') && !curr.includes('-')) {
				prev.push(index);
			}
			return prev;
		}, []);
		const filteredTeamNames = teamNames.filter((_, index) => itemsToFilter.includes(index));
		const matches = [];
		for(let i = 0; i < filteredTeamNames.length - 1; i += 2) {
			const match = {
				TeamHome: filteredTeamNames[i].trim(),
				TeamAway: filteredTeamNames[i+1].trim()
			};
			matches.push(match);
		}
		const odds = await this.findOdds();
		const dates = await this.findDates(matches.length);
		const matchesFormated = matches.map((match, index) => {
			return {
				...match,
				...odds[index],
				MatchDate: dates[index]
			};
		});
		return matchesFormated;
	}

	async findDates(indexLimit) {
		const dates = await this.currentPage.evaluate((indexLimit) => {
			const hours = Array.from(document.querySelectorAll('.element.date.date-color'));
			const dates = hours.slice(0, indexLimit).map(hour => {
				const parentDate = hour.parentElement.parentElement.parentElement.parentElement.textContent;
				const splitedDateString = parentDate.split(' ');
				splitedDateString.shift();
				splitedDateString.shift();
				const trueDate = splitedDateString[0];
				return `${trueDate} ${hour.textContent}`;
			});
			return dates;
		}, indexLimit);
		return dates;
	}

	async findOdds() {
		// const odds = await this.currentPage.$$('.btn.bet-btn.waves-effect.waves-light.flex-item.twoRow.ng-star-inserted');
		const odds = await this.currentPage.evaluate(() => {
			const odds = Array.from(document.querySelectorAll('.btn.bet-btn.waves-effect.waves-light.flex-item.twoRow'));
			const oddTextContent = odds.map(odd => odd.textContent);
			return oddTextContent;
		});
		const oddsFormated = [];
		for(let i = 0; i < odds.length; i += 8) {
			const oddMatch = {
				OddHome: Normalize.getOnlyStringNumbers(odds[i]),
				OddTie: Normalize.getOnlyStringNumbers(odds[i+1]),
				OddAway: Normalize.getOnlyStringNumbers(odds[i+2])
			};
			oddsFormated.push(oddMatch);
		}
		return oddsFormated;
	}

}

export default EstrelaCrawler;
