

var starColorRanges = [-0.33, -0.17, 0.15, 0.44, 0.68, 1.15, 1.64];
//var starColorValues = ["#00BFFF", "#87CEFA", "#AFEEEE", "#EEE8AA", "#FFD700", "#FF8C00", "#FF4500"];
var starColorValues = ["#9db4ff", "#afc3ff", "#e4e8ff", "#fbf8ff", "#fff4e8", "#FFd7ae", "#FFbb7b"];


//set up standard scene objects
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var particles = new THREE.Geometry();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 10000000000000 );
var controls = new THREE.TrackballControls( camera );

//calculate actual color of the star
function calculateColor(colorIndex){
	for (var i = 0; i < starColorRanges.length; i++){
		if (colorIndex < starColorRanges[i]){
			return starColorValues[i];
		}
	}
	return starColorValues[starColorValues.length-1];
}


//animate
function animate() {
	requestAnimationFrame( animate );
	controls.update();
	render();
}


//render the scene
function render() {
	//requestAnimationFrame(render);
	renderer.render( scene, camera );
}


//build camera controls
function buildControls(){
	camera.position.z = 5;
	controls.rotateSpeed = .5;
	controls.zoomSpeed = .4;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
}


//calculate coordinate to scale
function toScaleCoordinate(coordinate){
	return coordinate;
	var sunDiameterInParsecs = 1 / (.0000000225461 * 2);
	return coordinate * sunDiameterInParsecs;
}


//clear loading screen
function clearLoadingScreen(){
	var element = document.getElementById("loading-screen");
	if (element==null){
		return;
	}
	element.style.display="none";
}

//reload objcts in scene
function reloadObjectsInScene(){
	scene.remove(scene.children[0]);
	loadDataAndObjects();
}

//create gemoetrical objects from objects in data
function loadObjectsInScene(objectsArray){
	log("Loading objects");
	
	for (var i = 0; i < objectsArray.length; i++){
	        var o = objectsArray[i];

		if (o.dist >= 10000000 || o.dist < 0){
			continue;
		}
	
		// add element
		var x = toScaleCoordinate(o.x);
		var y = toScaleCoordinate(o.y);
		var z = toScaleCoordinate(o.z);
		var color = calculateColor(o.ci);

		//create numerous particles on same spot so brightness appears more
		for (var i2 = 0; i2 < 2; i2++){
	        	var particle = new THREE.Vector3(x, y, z);
			particles.vertices.push(particle);
			particles.colors.push(new THREE.Color(color));
		}		
	}


	var material = new THREE.PointsMaterial({
		vertexColors: THREE.VertexColors,
                size: 1,
		map: THREE.ImageUtils.loadTexture("./images/star.png"),
      		blending: THREE.AdditiveBlending,
      		transparent: true,
		depthWrite: false
        });
	
	var pointCloud = new THREE.Points(particles, material);
	scene.add(pointCloud);
	
	// create the particle system
	log("Finished loading objects.");
}


//load data nd objects
function loadDataAndObjects(){
	var intervalId = setInterval(function(){
		if (window.celestialData){
			clearInterval(intervalId);
			loadObjectsInScene(window.celestialData);
			clearLoadingScreen();
		}
	}, 1000);
}


//main method
function main(){
        buildControls();
	loadDataAndObjects();
	animate();
}


main();
