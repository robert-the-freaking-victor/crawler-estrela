import Normalize from '../utils/normalize.js';
import Crawler from './crawler.js';

class EstrelaCrawler extends Crawler {
	
	/**
	 * Constructor function
	 * @param {number} msTimeout timeout in ms
	 */
	constructor(msTimeout) {
		super(msTimeout);
	}

	/**
	 * Get all team names on the page and returns on an array
	 * @returns {Promise<Array<string>>}
	 */
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

	/**
	 * Find all matches and fills it with odds and match date
	 * @returns {Promise<Array<object>>}
	 */
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

	/**
	 * Find dates from all matches
	 * @param {number} indexLimit index limit of array dates, that is defined according to the number of matches
	 * @returns {Promise<string>}
	 */
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

	/**
	 * Find the odds of all matches
	 * @returns {Promise<Array<object>>}
	 */
	async findOdds() {
		const odds = await this.currentPage.evaluate(() => {
			const odds = Array.from(document.querySelectorAll('.btn.bet-btn.waves-effect.waves-light.flex-item.twoRow'));
			const oddTextContent = odds.map(odd => odd.textContent);
			return oddTextContent;
		});
		const oddsFormated = [];
		for(let i = 0; i < odds.length; i += 8) {
			const oddMatch = {
				OddHome: +Normalize.getOnlyStringNumbers(odds[i]),
				OddTie: +Normalize.getOnlyStringNumbers(odds[i+1]),
				OddAway: +Normalize.getOnlyStringNumbers(odds[i+2])
			};
			oddsFormated.push(oddMatch);
		}
		return oddsFormated;
	}

}

export default EstrelaCrawler;
