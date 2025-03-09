import { ThreeUtils } from "./three-utils.js";

export function Stage(debug) {
	this.autoRotate = false;
	this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
	var position = new THREE.Vector3(0, 45, 0);
	this.camera.position.x = 0;
	this.camera.position.y = 45;
	this.camera.position.z = 0;
	this.renderer = new THREE.WebGLRenderer();
	this.renderer.setClearColor(0x111111);
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.scene = new THREE.Scene();
	this.scene.rotateY(Math.PI);

	this.setZoomLevel(-100);


	const centerAxis = new THREE.AxisHelper(5);
	if (debug) {
		this.scene.add(centerAxis);
	}

	//camera
	this.camera.lookAt(centerAxis.position);
	//camera.lookAt(scene.position);
}

Stage.prototype = {
	render() {
		this.renderer.render(this.scene, this.camera);
		if (this.autoRotate) {
			ThreeUtils.spinObj(this.scene, 'y', 0.001);
		}
	},
	add(item) {
		this.scene.add(item);
	},
	setZoomLevel(desiredZoom) {
		const zoomDiff = desiredZoom - this.camera.position.z;
		this.camera.translateZ(zoomDiff);
	},
	rotateScene(desiredRotation) {
		this.scene.rotateY(desiredRotation);
	},
	getCanvas() {
		return this.renderer.domElement;
	},
	enableAutoRotate() {
		this.autoRotate = true;
	},
	disableAutoRotate() {
		this.autoRotate = false;
	},
};