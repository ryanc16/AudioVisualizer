var debug = false;
var output = $("#output");
var scene, camera, renderer;
var autoRotate = !debug;
var bars = [];
var tracks = [
	{name:"Do The Math",src:"dothemath.mp3"},
	{name:"Cinema",src:"Cinema.mp3"},
	{name:"HRH Radio",src:"http://listen.djcmedia.com/hrhradiohigh"}
];
//create new instance of audio 
var audio = new Audio();
var source, context, analyser, fbc_array;
var held;
var startPos;
var lastPos;
var mouse = new THREE.Vector2();

// once everything is loaded, we run our Three.js stuff.
//ON START
$(function () {
	
	$(window).on("load", initMp3Player);
    //all the Three.js stuff

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene = new THREE.Scene();
	scene.rotateY(Math.PI);
	
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x111111);
    renderer.setSize(window.innerWidth, window.innerHeight);

	var Plight1 = new THREE.PointLight( 0xff0000, 1, 75 );
	Plight1.position.set( -40, 0, -30);
	scene.add( Plight1 );
	
	var Plight2 = new THREE.PointLight( 0xff0000, 1, 75 );
	Plight2.position.set( 40, 0, -30);
	scene.add( Plight2 );
	
	var Plight3 = new THREE.PointLight( 0xff0000, 1, 75 );
	Plight3.position.set( -40, 0, 30);
	scene.add( Plight3 );
	
	var Plight4 = new THREE.PointLight( 0xff0000, 1, 75 );
	Plight4.position.set( 40, 0, 30);
	scene.add( Plight4 );
	
	var Alight1 = new THREE.AmbientLight(0x777777);
	//light.position.set(3, 3, 3).normalize();
	scene.add(Alight1);

    //var axes = new THREE.AxisHelper(5);
    //scene.add(axes);

    var position = new THREE.Vector3(0, 0, 0);

    camera.position.x = 0;
    camera.position.y = 45;
    camera.position.z = 0;
	
	for(var i=0;i<64;i++){
		var bar = CreateBar({x:(i+i)-64,y:0,z:0},{l:1,h:10,w:2});
		//var bar = CreateBar({x:Math.cos(i/10.2)*50,y:0,z:Math.sin(i/10.2)*50},{l:3,h:10,w:3});
		bars.push(bar);
		setBarHeight(bar,0.1,false);
		scene.add(bar);
	}	
	setZoomLevel(-100);
	
	var plane = CreatePlane(300,300,1,1,"#111111");
	plane.position.set(0,0,0);
	plane.rotation.set(-Math.PI/2,0,0);
	scene.add(plane);

    var center = new THREE.AxisHelper(5);
    //if (debug) scene.add(center);

    //camera
    camera.lookAt(center.position);
    //camera.lookAt(scene.position);
    output.append(renderer.domElement);
    renderer.render(scene, camera);

    $("#autoRotate").change(function () {
        autoRotate = !autoRotate;
    });
    /////////////////////////////////////////////////////////////////////////////////
    ////////////////////////    Track selection method    ////////////////////////
    /////////////////////////////////////////////////////////////////////////////////
	
	//POPULATE
	//fill the dropdownbox with all the tracks from tracks array
	$.each(tracks,function(i,o){
		$("#trackSelection").append("<option value='"+i+"'>"+o.name+"</option>");
	});
	// TRACK DROPDOWN CHANGE
    $("#trackSelection").change(function (e) {
		fbc_array = new Uint8Array(64);
       $(audio).prop('src',tracks[e.target.value].src);
    });
              
   
    $(output).mousedown(function (e) {
        held = true;
        output.addClass('grab');
        lastPos = Array(e.offsetX, e.offsetY);
    }).bind('mouseup mouseleave', function () {
        held = false;
        output.removeClass('grab');
    });
    
    //MOUSE CONTROLS
    $(output).on('mousemove', function (e) {
        e.preventDefault();
		if (held) {
			startPos = Array(e.offsetX, e.offsetY);
			var xPos = (lastPos[0] - startPos[0]) / 50;
			var xDisp = Math.abs(Math.round(Rads2Degs(scene.rotation.x) * 100) / 100);

			scene.rotateY(-xPos / 4);

			//console.clear();
			//console.log(scene.rotation);

			lastPos = startPos;
		} else {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		}
    });
    //TOUCH CONTROLS
    $(output).on('touchstart', function (e) {
        held = true;
        lastPos = Array(e.originalEvent.touches[0].screenX, e.originalEvent.touches[0].screenY);
        if (e.originalEvent.touches.length === 2) {
            lastDist = getDistance(new THREE.Vector2(e.originalEvent.touches[0].screenX, e.originalEvent.touches[0].screenY), new THREE.Vector2(e.originalEvent.touches[1].screenX, e.originalEvent.touches[1].screenY));
        }
    }).bind('touchend touchcancel', function () {
        held = false;
    });
    var startPos1, startPos2, lastPos, lastDist;
    $(output).on('touchmove', function (e) {
        e.preventDefault();
		if (held) {
			//rotating the molecule with touch
			if (e.originalEvent.touches.length === 1) {
				//orbit
				autoRotate = false;
				startPos1 = Array(e.originalEvent.touches[0].screenX, e.originalEvent.touches[0].screenY);
				var xPos = (lastPos[0] - startPos1[0]) / 50;

				var xDisp = Math.abs(Math.round(Rads2Degs(scene.rotation.x) * 100) / 100);

				scene.rotateY(-xPos / 4);

				lastPos = startPos1;
				//pinching to zoom
			} else if (e.originalEvent.touches.length === 2) {
				var touch1 = Array(e.originalEvent.touches[0].screenX, e.originalEvent.touches[0].screenY);
				var touch2 = Array(e.originalEvent.touches[1].screenX, e.originalEvent.touches[1].screenY);
				var v1 = new THREE.Vector2(touch1[0], touch1[1]);
				var v2 = new THREE.Vector2(touch2[0], touch2[1]);
				var distance = getDistance(v1, v2);
				var amt = (distance - lastDist) / 5;

				if (camera.position.z - amt < 150 && camera.position.z - amt > 10)
					camera.translateZ(-amt);
				lastDist = distance;
			}
		}
    });

    //detect resizing
    window.addEventListener('resize', onWindowResize, false);
});
//HELPER FUNCTIONS
function initMp3Player(){
	audio.crossOrigin = "anonymous";
	//audio.src = 'http://listen.djcmedia.com/hrhradiohigh';
	audio.src = tracks[0].src;
	audio.controls = true;
	audio.loop = true;
	audio.autoplay = true;
	
	$('#audio_box').html(audio);
	
	context = new AudioContext();
	analyser = context.createAnalyser();
	
	analyser.fftSize = 2048;
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	render();
}

//use this as our update function
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    if(autoRotate) spinObj(scene, 'y', 0.001);
	
	fbc_array = new Uint8Array(64);
	analyser.getByteFrequencyData(fbc_array);
	
	$.each(bars,function(i,o){
		if(fbc_array[i]/50 > 0)
			setBarHeight(o,fbc_array[i]/50,false);
	});
}
function CreatePlane(width, height, widthSegs, heightSegs, color) {
    var planeGeometry = new THREE.PlaneGeometry(width, height, widthSegs, heightSegs);
    var planeMaterial = new THREE.MeshBasicMaterial({color: color});
    return new THREE.Mesh(planeGeometry, planeMaterial);
}
function CreateBar(position,size){
	var barGeometry = new THREE.BoxGeometry(size.l,size.h,size.w);
	var barMaterial = new THREE.MeshPhongMaterial({color: '#5599DD'});
	var bar = new THREE.Mesh(barGeometry,barMaterial);
	bar.position.set(position.x,position.y,position.z);
	return bar;
}
function setBarHeight(bar,height,relative){
	if(relative) bar.scale.y += height;
	else		 bar.scale.y = height;
}
function setZoomLevel(desiredZoom) {
    var zoomDiff = desiredZoom - camera.position.z;
    camera.translateZ(zoomDiff);
}
function Rads2Degs(radians) {
    return (180 * radians) / Math.PI;
}
function Degs2Rads(degrees) {
    return (degrees * Math.PI) / 180;
}
function getDistance(point1, point2) {
    var x = point2.x - point1.x;
    var y = point2.y - point1.y;
    var distance = Math.sqrt(x * x + y * y);
    return distance;
}
function spinObj(obj, axis, amt) {
    if (axis.toUpperCase() == 'X') {
        obj.rotateX(amt);
    } else if (axis.toUpperCase() == 'Y') {
        obj.rotateY(amt);
    } else if (axis.toUpperCase() == 'Z') {
        obj.rotateZ(amt);
    }
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}