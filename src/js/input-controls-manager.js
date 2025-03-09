import { Vector2Utils } from "./vector2-utils.js";

export function InputControlsManager() {
	this.zoom = 0;
	this.zoomLimits = { min: -50, max: 200 };
	this.onDragHandler = (amt) => { };
	this.onZoomHandler = (amt) => { };
}

InputControlsManager.prototype = {
	init(output) {
		let held = false;
		let lastPos = null;
		$(output).mousedown(e => {
			held = true;
			output.addClass('grab');
			lastPos = [e.offsetX, e.offsetY];
		}).bind('mouseup mouseleave', function() {
			held = false;
			output.removeClass('grab');
		});

		let startPos = null;
		let mouse = new THREE.Vector2();
		// MOUSE CONTROLS
		$(output).on('mousemove', e => {
			e.preventDefault();
			if (held) {
				startPos = [e.offsetX, e.offsetY];
				const scalingFactor = 50;
				const xPos = (lastPos[0] - startPos[0]) / scalingFactor;
				lastPos = startPos;
				this.onDragHandler(-xPos / 4);
			} else {
				mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
				mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
			}
		});
		// ZOOM CONTROLS
		$(output)[0].addEventListener('wheel', e => {
			e.preventDefault();
			if (e.deltaY > 0 && this.zoom < this.zoomLimits.max) {
				this.onZoomHandler(1);
				this.zoom += 1;
			} else if (e.deltaY < 0 && this.zoom > this.zoomLimits.min) {
				this.onZoomHandler(-1);
				this.zoom -= 1;
			}
		});

		//TOUCH CONTROLS
		let lastDist;
		$(output).on('touchstart', e => {
			held = true;
			const touches = [
				...e.originalEvent.touches
			];
			// touches.push({ screenX: 450, screenY: 35 });
			lastPos = [touches[0].screenX, touches[0].screenY];
			if (touches.length === 2) {
				const p1 = new THREE.Vector2(touches[0].screenX, touches[0].screenY);
				const p2 = new THREE.Vector2(touches[1].screenX, touches[1].screenY);
				lastDist = Vector2Utils.distanceBetween(p1, p2);
			}
		}).bind('touchend touchcancel', function() {
			held = false;
		});

		let startPos1;
		$(output).on('touchmove', e => {
			e.preventDefault();
			const touches = [
				...e.originalEvent.touches
			];
			if (held) {
				//rotating the visualizer with touch
				if (touches.length === 1) {
					startPos1 = [touches[0].screenX, touches[0].screenY];
					const xPos = (lastPos[0] - startPos1[0]) / 50;

					lastPos = startPos1;
					this.onDragHandler(-xPos / 4);
					//pinching to zoom
				} else if (touches.length === 2) {
					const touch1 = [touches[0].screenX, touches[0].screenY];
					const touch2 = [touches[1].screenX, touches[1].screenY];
					const v1 = new THREE.Vector2(touch1[0], touch1[1]);
					const v2 = new THREE.Vector2(touch2[0], touch2[1]);
					const distance = Vector2Utils.distanceBetween(v1, v2);
					const deltaY = -1 * (distance - lastDist) / 5;

					if (deltaY > 0 && this.zoom < this.zoomLimits.max) {
						this.onZoomHandler(deltaY);
						this.zoom += deltaY;
					} else if (deltaY < 0 && this.zoom > this.zoomLimits.min) {
						this.onZoomHandler(deltaY);
						this.zoom += deltaY;
					}
					lastDist = distance;
				}
			}
		});
	},
	onDrag(handler) {
		this.onDragHandler = handler;
	},
	onZoom(handler) {
		this.onZoomHandler = handler;
	}
};