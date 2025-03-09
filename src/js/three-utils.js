export const ThreeUtils = {
	spinObj(obj, axis, amt) {
		if (axis.toUpperCase() == 'X') {
			obj.rotateX(amt);
		} else if (axis.toUpperCase() == 'Y') {
			obj.rotateY(amt);
		} else if (axis.toUpperCase() == 'Z') {
			obj.rotateZ(amt);
		}
	}
};