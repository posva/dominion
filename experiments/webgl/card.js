var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 20000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
THREEx.WindowResize(renderer, camera);

camera.position.z = 150;
camera.position.y = 150;
camera.position.x = 150;

var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
scene.add(skyBox);
scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

var light = new THREE.PointLight(0xffffff);
light.position.set(100,250,100);
scene.add(light);
var ambientLight = new THREE.AmbientLight(0x111111);
scene.add(ambientLight);

renderer.shadowMapEnabled = true;

var spotlight = new THREE.SpotLight(0xffff00);
spotlight.position.set(360, 350, 360);
spotlight.shadowCameraVisible = true;
spotlight.shadowDarkness = 0.75;
spotlight.intensity = 0.3;
// must enable shadow casting ability for the light
spotlight.castShadow = true;
scene.add(spotlight);

var spotlight2 = new THREE.SpotLight(0x889999);
spotlight2.position.set(-360, 350, 360);
scene.add(spotlight2);
spotlight2.shadowCameraVisible = true;
spotlight2.shadowDarkness = 0.70;
spotlight2.intensity = 2;
spotlight2.castShadow = true;

var cubeGeometry = new THREE.BoxGeometry(0.1, (32/21) * 50  , 50 );
var backCard = new THREE.ImageUtils.loadTexture( '../../data/img/card/layout/main-full.png' );
var frontCard = new THREE.ImageUtils.loadTexture( '../../data/img/card/layout/victory-full.png' );
var cubeMaterial = new THREE.MeshLambertMaterial({
  map:backCard,
  //color: 0x888888
});
var materialArray = [];
materialArray.push(new THREE.MeshLambertMaterial({ map: frontCard, transparent: true }));
materialArray.push(new THREE.MeshLambertMaterial({ map: backCard, transparent: true }));
var sidesMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0});
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
var cardMaterial = new THREE.MeshFaceMaterial(materialArray);
cardMaterial.transparent = true;

cubeMaterial.transparent = true;
var cube = new THREE.Mesh( cubeGeometry, cardMaterial );
cube.position.set(0,50,0);
// Note that the mesh is flagged to cast shadows
cube.castShadow = true;
scene.add(cube);

// floor: mesh to receive shadows
var floorTexture = new THREE.ImageUtils.loadTexture( 'wood.jpg' );
floorTexture.minFilter = THREE.NearestFilter;
//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
//floorTexture.repeat.set( 10, 10 );
// Note the change to Lambert material.
var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneBufferGeometry(1000, 1000, 100, 100);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
// Note the mesh is flagged to receive shadows
floor.receiveShadow = true;
scene.add(floor);

var stats;
stats = new Stats();
if (stats) {
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  document.body.appendChild(stats.domElement);
}

var controls;
controls = new THREE.OrbitControls( camera, renderer.domElement );

var render = function () {
  requestAnimationFrame( render );

  cube.rotation.y += 0.02;

  if (stats)
    stats.update();
  if (controls)
    controls.update();

  renderer.render(scene, camera);
};

render();
