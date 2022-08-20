module.exports = async promise => {
	try {
		const data = await promise;
		return [data, null];
	} catch(error) {
		console.error(error);
		return [null, error];
	}
}
