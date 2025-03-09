export function Visualizer(stage) {
	this.bars = [];

	for (var i = 0; i < 64; i++) {
		const bar = this._createAudioBandBar({ x: (i + i) - 64, y: 0, z: 0 }, { l: 1, h: 10, w: 2 });
		//var bar = _createAudioBandBar({x:Math.cos(i/10.2)*50,y:0,z:Math.sin(i/10.2)*50},{l:3,h:10,w:3});
		this.bars.push(bar);
		this.setBarHeight(bar, 0.1, false);
		stage.scene.add(bar);
	}

	const plane = this._createPlane(300, 300, 1, 1, "#111111");
	plane.position.set(0, 0, 0);
	plane.rotation.set(-Math.PI / 2, 0, 0);
	stage.scene.add(plane);
}

Visualizer.prototype = {
	updateBars(data) {
		$.each(this.bars, (idx, bar) => {
			if ((data[idx] / 50) > 0) {
				this.setBarHeight(bar, data[idx] / 50, false);
			}
		});
	},
	/**
	 * Set a frequency bar height
	 * @param {*} bar
	 * @param {*} height
	 * @param {*} relative
	 */
	setBarHeight(bar, height, relative) {
		if (relative) {
			bar.scale.y += height;
		} else {
			bar.scale.y = height;
		}
	},
	_createPlane(width, height, widthSegs, heightSegs, color) {
		var planeGeometry = new THREE.PlaneGeometry(width, height, widthSegs, heightSegs);
		var planeMaterial = new THREE.MeshBasicMaterial({ color: color });
		return new THREE.Mesh(planeGeometry, planeMaterial);
	},
	_createAudioBandBar(position, size) {
		var barGeometry = new THREE.BoxGeometry(size.l, size.h, size.w);
		var barMaterial = new THREE.MeshPhongMaterial({ color: '#5599DD' });
		var bar = new THREE.Mesh(barGeometry, barMaterial);
		bar.position.set(position.x, position.y, position.z);
		return bar;
	},
};