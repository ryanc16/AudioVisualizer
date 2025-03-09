export function Mp3Player() {
	this.audio = new Audio();
	this.audio.crossOrigin = "anonymous";
	this.audio.controls = true;
	this.audio.loop = true;
	this.audio.autoplay = true;

	this.context = new AudioContext();

	this.analyser = this.context.createAnalyser();
	this.analyser.fftSize = 2048;

	this.source = this.context.createMediaElementSource(this.audio);
	this.source.connect(this.analyser);
	this.analyser.connect(this.context.destination);
	this.fbc_array = new Uint8Array(64);
}

Mp3Player.prototype = {
	selectTrack(trackSrc) {
		this.fbc_array = new Uint8Array(64);
		$(this.audio).prop('src', trackSrc);
	},
	analyzeTrackAtCurrentTime() {
		this.analyser.getByteFrequencyData(this.fbc_array);
		return this.fbc_array;
	}
};