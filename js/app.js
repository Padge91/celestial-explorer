

var starColorRanges = [-0.33, -0.17, 0.15, 0.44, 0.68, 1.15, 1.64];
//var starColorValues = ["#00BFFF", "#87CEFA", "#AFEEEE", "#EEE8AA", "#FFD700", "#FF8C00", "#FF4500"];
var starColorValues = ["#9db4ff", "#afc3ff", "#e4e8ff", "#fbf8ff", "#fff4e8", "#FFd7ae", "#FFbb7b"];


//set up standard scene objects
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var particles = new THREE.Geometry();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


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
}


//render the scene
function render() {
	renderer.render( scene, camera );
}


//build camera controls
function buildControls(){
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, .1, 10000000000000 );
	camera.position.z = 5;
	controls = new THREE.TrackballControls( camera );
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;
	controls.keys = [ 65, 83, 68 ];
	controls.addEventListener( 'change', render );
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
		var x = o.x;
		var y = o.y;
		var z = o.z;
		var color = calculateColor(o.ci);

	        var particle = new THREE.Vector3(x, y, z);

		particles.vertices.push(particle);
		particles.colors.push(new THREE.Color(color));
		
	}


	var material = new THREE.PointsMaterial({
		vertexColors: THREE.VertexColors,
                size: .5,
		map: THREE.ImageUtils.loadTexture("/images/particle.png"),
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
