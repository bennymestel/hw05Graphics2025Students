import { OrbitControls } from './OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x000000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
directionalLight.castShadow = true;
scene.add(directionalLight);

renderer.shadowMap.enabled = true;

function degrees_to_radians(degrees) {
  return degrees * (Math.PI / 180);
}

function createBasketballCourt() {
  const courtWidth = 30;
  const courtLength = 15;
  const courtGeometry = new THREE.PlaneGeometry(courtWidth, courtLength);
  const courtMaterial = new THREE.MeshPhongMaterial({ color: 0xc68642, shininess: 50 });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.rotation.x = -Math.PI / 2;
  court.position.y = 0;
  court.receiveShadow = true;
  scene.add(court);

  const centerLineGeometry = new THREE.BufferGeometry();
  const centerLineVertices = new Float32Array([
    -courtWidth / 2, 0, 0,
    courtWidth / 2, 0, 0
  ]);
  centerLineGeometry.setAttribute('position', new THREE.BufferAttribute(centerLineVertices, 3));
  const centerLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  const centerLine = new THREE.Line(centerLineGeometry, centerLineMaterial);
  centerLine.position.y = 0.01;
  scene.add(centerLine);

  const centerCircleGeometry = new THREE.RingGeometry(1.5, 2, 32);
  const centerCircleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
  centerCircle.position.y = 0.02;
  centerCircle.rotation.x = -Math.PI / 2;
  scene.add(centerCircle);

  // Left arc
  const threePointArc1Curve = new THREE.EllipseCurve(0, 0, 7.5, 7.5, -Math.PI / 2, Math.PI / 2, false, 0);
  const threePointArc1Points = threePointArc1Curve.getPoints(50);
  const threePointArc1Geometry = new THREE.BufferGeometry().setFromPoints(threePointArc1Points);
  const threePointArc1 = new THREE.Line(threePointArc1Geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  threePointArc1.position.set(-15, 0.03, 0);
  threePointArc1.rotation.x = -Math.PI / 2;
  scene.add(threePointArc1);

  // Right arc
  const threePointArc2Curve = new THREE.EllipseCurve(0, 0, 7.5, 7.5, Math.PI / 2, 3 * Math.PI / 2, false, 0);
  const threePointArc2Points = threePointArc2Curve.getPoints(50);
  const threePointArc2Geometry = new THREE.BufferGeometry().setFromPoints(threePointArc2Points);
  const threePointArc2 = new THREE.Line(threePointArc2Geometry, new THREE.LineBasicMaterial({ color: 0xffffff }));
  threePointArc2.position.set(15, 0.03, 0);
  threePointArc2.rotation.x = -Math.PI / 2;
  scene.add(threePointArc2);
}

createBasketballCourt();

const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p>O - Toggle orbit camera</p>
`;
document.body.appendChild(instructionsElement);

document.addEventListener('keydown', (e) => {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();
