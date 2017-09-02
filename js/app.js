
//set up standard scene objects
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//camera
camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	controls.update();
}

function render() {
	renderer.render( scene, camera );
	stats.update();
}

function buildControls(){
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 500;
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

buildControls();
animate();

//create gemoetrical objects from objects in data
function loadObjectsInScene(objectsArray){
	log("Loading objects");
	for (var i = 0; i < objectsArray.length; i++){
	        var o = objectsArray[i];
		// formula for converting to galactic coordinates
		var xg =  -(0.0550*o.x) -(0.8732*o.y) - (0.4839*o.z)
		var yg =  (0.4940*o.x) - (0.4449*o.y) + (0.7470*o.z)
		var zg = -(0.8677*o.x) - (0.1979*o.y) + (0.4560*o.z)
		log(o);
		
	        var geometry = new THREE.SphereGeometry( 1);
	        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	        var sphere = new THREE.Mesh( geometry, material );
	        scene.add( sphere );
	        sphere.position.set(xg,yg,zg);
		if (i >= 1000){
			break;
		}
	}
	log("Finished loading objects.");
}

var intervalId = setInterval(function(){
	if (window.celestialData){
		clearInterval(intervalId);
		loadObjectsInScene(window.celestialData);
	}
}, 1000);
