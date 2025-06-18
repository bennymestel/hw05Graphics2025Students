import {OrbitControls} from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt() {
  // Court floor - using PlaneGeometry with 2:1 ratio
  const courtWidth = 30;  // Width of the court
  const courtLength = 15; // Length of the court (2:1 ratio)
  const courtGeometry = new THREE.PlaneGeometry(courtWidth, courtLength);
  const courtMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc68642,  // Brown wood color
    shininess: 50
  });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  
  // Position the court horizontally (rotate to lay flat)
  court.rotation.x = -Math.PI / 2; // Rotate 90 degrees to make it horizontal
  court.position.y = 0; // Position at ground level
  
  court.receiveShadow = true;
  scene.add(court);
  
  // Add white center line across the court
  const centerLineGeometry = new THREE.BufferGeometry();
  const centerLineVertices = new Float32Array([
    -courtWidth/2, 0, 0,  // Start point (left side of court)
    courtWidth/2, 0, 0    // End point (right side of court)
  ]);
  centerLineGeometry.setAttribute('position', new THREE.BufferAttribute(centerLineVertices, 3));
  
  const centerLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White color
  const centerLine = new THREE.Line(centerLineGeometry, centerLineMaterial);
  
  // Position the center line on the court (slightly above to avoid z-fighting)
  centerLine.position.y = 0.01;
  
  scene.add(centerLine);
  
  // Add white center circle at center court
  const centerCircleGeometry = new THREE.RingGeometry(1.5, 2, 32); // Inner radius 1.5, outer radius 2, 32 segments
  const centerCircleMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff,  // White color
    side: THREE.DoubleSide // Render both sides
  });
  const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
  
  // Position the center circle on the court (slightly above to avoid z-fighting)
  centerCircle.position.y = 0.02;
  centerCircle.rotation.x = -Math.PI / 2; // Rotate to lay flat like the court
  
  scene.add(centerCircle);
  
  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
}

// Create all elements
createBasketballCourt();

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
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

// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();
