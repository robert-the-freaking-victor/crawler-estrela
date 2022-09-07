
class Normalize {

	/**
	 * Get a string and left only numbers and dots
	 * @param {string} value 
	 * @returns {string}
	 */
	static getOnlyStringNumbers(value) {
		const normalizeValue = value.replace(/[^0-9\.]/g, '');
		return normalizeValue;
	}

}

export default Normalize;
