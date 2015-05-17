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

renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.shadowMapEnabled = true;

var CARD_HEIGHT = 50,
CARD_WIDTH = (32 / 21) * CARD_HEIGHT,
CARD_THICKNESS = 1;

var spotlight = new THREE.SpotLight(0xfff4e5);
spotlight.position.set(360, 350, -360);
spotlight.shadowCameraVisible = true;
spotlight.shadowDarkness = 0.75;
spotlight.intensity = 0.6;
// must enable shadow casting ability for the light
spotlight.castShadow = true;
scene.add(spotlight);

var spotlight2 = new THREE.SpotLight(0x889999);
spotlight2.position.set(-360, 150, 360);
scene.add(spotlight2);
spotlight2.shadowCameraVisible = true;
spotlight2.shadowDarkness = 0.70;
spotlight2.intensity = 0.9;
spotlight2.castShadow = true;

var cubeGeometry = new THREE.BoxGeometry(0.1, CARD_WIDTH, CARD_HEIGHT);
var backCard = new THREE.ImageUtils.loadTexture('../../data/img/card/layout/main-full.png');
var backCardNormals = new THREE.ImageUtils.loadTexture('../../data/img/card/layout/main-full_NRM.jpg');
backCard.minFilter = THREE.NearestFilter;
var frontCard = new THREE.ImageUtils.loadTexture('../../data/img/card/layout/treasure-potion-full.png');
var frontCardNormals = new THREE.ImageUtils.loadTexture('../../data/img/card/layout/treasure-potion-full_NRM.jpg');
frontCard.minFilter = THREE.NearestFilter;
var cubeMaterial = new THREE.MeshLambertMaterial({
  map: backCard,
  //color: 0x888888
});
var materialArray = [];
materialArray.push(new THREE.MeshPhongMaterial({
  map: frontCard,
  normalMap: frontCardNormals,
  normalScale: new THREE.Vector2( 0.8, 0.8 ),
  transparent: true
}));
materialArray.push(new THREE.MeshPhongMaterial({
  map: backCard,
  normalMap: backCardNormals,
  normalScale: new THREE.Vector2( 0.8, 0.8 ),
  transparent: true
}));
var sidesMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.0});
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
materialArray.push(sidesMaterial);
var cardMaterial = new THREE.MeshFaceMaterial(materialArray);
cardMaterial.transparent = true;

cubeMaterial.transparent = true;
var cards = [];
var cube = new THREE.Mesh(cubeGeometry, cardMaterial);
cube.position.set(0, CARD_HEIGHT, 0);
// Note that the mesh is flagged to cast shadows
cube.castShadow = true;
scene.add(cube);
cards.push(cube);

cube = new THREE.Mesh(cubeGeometry, cardMaterial);
cube.position.set(-CARD_HEIGHT * 1.1, CARD_HEIGHT, 0);
// Note that the mesh is flagged to cast shadows
cube.castShadow = true;
cube.rotation.y = THREE.Math.degToRad(90);
scene.add(cube);
cards.push(cube);

cube = new THREE.Mesh(cubeGeometry, cardMaterial);
cube.position.set(CARD_HEIGHT * 1.1, CARD_HEIGHT, 0);
// Note that the mesh is flagged to cast shadows
cube.castShadow = true;
cube.rotation.y = THREE.Math.degToRad(180);
scene.add(cube);
cards.push(cube);

cards.forEach(function(card) {
  card.position.y = CARD_HEIGHT / 2;
  card.rotation.y = 0;
  card.rotation.y = THREE.Math.degToRad(270);
})

cube.customDepthMaterial = new THREE.ShaderMaterial({
  uniforms: THREE.ShaderLib['basic'].uniforms,
  vertexShader: document.getElementById('vertexShaderDepth').textContent,
  fragmentShader: document.getElementById('fragmentShaderDepth').textContent,
});

var extraCardGeometry = new THREE.PlaneGeometry(CARD_HEIGHT, CARD_WIDTH, 1, 1);
var extraCardMaterial = new THREE.MeshPhongMaterial({
  map: frontCard,
  transparent: true,
  normalMap: frontCardNormals,
  normalScale: new THREE.Vector2(1.8, 1.8),
  //side: THREE.DoubleSide
});
var extraCard = new THREE.Mesh(extraCardGeometry, extraCardMaterial);
scene.add(extraCard);
extraCard.castShadow = true;
extraCard.position.y = CARD_HEIGHT * 3;

// floor: mesh to receive shadows
var floorTexture = new THREE.ImageUtils.loadTexture('wood.jpg');
var floorNormals = new THREE.ImageUtils.loadTexture('wood_NRM.jpg');
floorTexture.minFilter = THREE.LinearFilter;
//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.onLoad = function() {
  //floorTexture.repeat.set(10000 / floorTexture.image.width, 10000 / floorTexture.image.height);
  //floorTexture.needsUpdate = true;
};
// Note the change to Lambert material.
var floorMaterial = new THREE.MeshPhongMaterial({
  map: floorTexture,
  //normalMap: floorNormals,
  //normalScale: new THREE.Vector2(1.8, 1.8),
  side: THREE.DoubleSide
});
var floorGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 1, 1);
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

  cards.forEach(function(card) {
    spotlight2.position.x = Math.sin(0.0005 * new Date()) * 360
    spotlight.position.x = -Math.sin(0.0005 * new Date()) * 360
    //card.rotation.y = Math.sin(0.0005 * new Date()) * Math.PI * 2;
    card.rotation.y += 0.02;
    card.position.y = CARD_HEIGHT / 2 + Math.sin(0.005 * new Date()) * 10 + 23;
  });

  if (stats)
    stats.update();
  if (controls)
    controls.update();

  renderer.render(scene, camera);
};

render();
