export const MathUtils = {
	/**
	 * @param {number} radians value in radians
	 * @returns {number} value in degrees
	 */
	rad2Deg(radians) {
		return (180 * radians) / Math.PI;
	},
	deg2Rad(degrees) {
		return (degrees * Math.PI) / 180;
	}
};