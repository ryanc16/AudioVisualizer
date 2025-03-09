import { Stage } from './stage.js';
import { Mp3Player } from './mp3player.js';
import { Visualizer } from './visualizer.js';
import { InputControlsManager } from './input-controls-manager.js';

// once everything is loaded, we run our Three.js stuff.
$(function() {
	const debug = false;
	const output = $("#output");
	const tracks = [
		{ name: "Do The Math", src: "audio/dothemath.mp3" },
		{ name: "Cinema", src: "audio/Cinema.mp3" },
		{ name: "Scary Monsters and Nice Sprites", src: "audio/scary_monsters_and_nice_sprites.mp3" },
		{ name: "Beautiful Now", src: "audio/zedd_beautiful_now.mp3" },
		{ name: "HRH Radio", src: "http://listen.djcmedia.com/hrhradiohigh" }
	];

	const stage = new Stage(debug);
	const visualizer = new Visualizer(stage);
	const player = new Mp3Player();
	const inputcontrols = new InputControlsManager(output);

	player.selectTrack(tracks[0].src);

	//all the Three.js stuff
	const Plight1 = new THREE.PointLight(0xff0000, 1, 75);
	Plight1.position.set(-40, 0, -30);
	stage.scene.add(Plight1);

	const Plight2 = new THREE.PointLight(0xff0000, 1, 75);
	Plight2.position.set(40, 0, -30);
	stage.scene.add(Plight2);

	const Plight3 = new THREE.PointLight(0xff0000, 1, 75);
	Plight3.position.set(-40, 0, 30);
	stage.scene.add(Plight3);

	const Plight4 = new THREE.PointLight(0xff0000, 1, 75);
	Plight4.position.set(40, 0, 30);
	stage.scene.add(Plight4);

	const Alight1 = new THREE.AmbientLight(0x777777);
	//light.position.set(3, 3, 3).normalize();
	stage.scene.add(Alight1);

	output.append(stage.getCanvas());

	const initialize = () => {
		$('#audio_box').html(player.audio);
		render();
	};

	//use this as our update function
	const render = () => {
		requestAnimationFrame(render);
		stage.render();

		const data = player.analyzeTrackAtCurrentTime();
		visualizer.updateBars(data);
	};

	$(window).on("load", initialize);

	$("#autoRotate").change(function() {
		stage.autoRotate = !stage.autoRotate;
	});
	/////////////////////////////////////////////////////////////////////////////////
	////////////////////////    Track selection method    ////////////////////////
	/////////////////////////////////////////////////////////////////////////////////

	//POPULATE
	//fill the dropdownbox with all the tracks from tracks array
	$.each(tracks, function(idx, track) {
		$("#trackSelection").append("<option value='" + idx + "'>" + track.name + "</option>");
	});
	// TRACK DROPDOWN CHANGE
	$("#trackSelection").change(function(e) {
		player.selectTrack(tracks[e.target.value].src);
	});

	inputcontrols.init(output);
	inputcontrols.onDrag(dragAmt => {
		stage.rotateScene(dragAmt);
	});
	inputcontrols.onZoom(delta => {
		stage.setZoomLevel(stage.camera.position.z + (delta * 2));
	});

	//detect window/viewport resizing
	window.addEventListener('resize', e => {
		stage.camera.aspect = window.innerWidth / window.innerHeight;
		stage.camera.updateProjectionMatrix();
		stage.renderer.setSize(window.innerWidth, window.innerHeight);
	});
});
