export const Vector2Utils = {
	/**
	 * Calculate the distance between two Vector2
	 * @param {THREE.Vector2} vector1
	 * @param {THREE.Vector2} vector2
	 * @returns {number} distance
	 */
	distanceBetween(vector1, vector2) {
		var x = vector2.x - vector1.x;
		var y = vector2.y - vector1.y;
		var distance = Math.sqrt(x * x + y * y);
		return distance;
	}
};