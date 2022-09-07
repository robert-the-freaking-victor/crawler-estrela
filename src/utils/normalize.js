
class Normalize {

	static getOnlyStringNumbers(value) {
		const normalizeValue = value.replace(/[^0-9\.]/g, '');
		return normalizeValue;
	}

}

export default Normalize;
