import { OrbitControls } from './OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color(0x000000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(15, 25, 20);
directionalLight.castShadow = true;

// Configure shadow properties for better quality
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

scene.add(directionalLight);

// Enable shadows with better quality
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

// Create basketball hoop
function createBasketballHoop() {
  // Backboard - white semi-transparent rectangular
  const backboardGeometry = new THREE.BoxGeometry(4, 3, 0.1);
  const backboardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.8 
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  backboard.position.set(-15, 8, 0); // Position at left side of court
  backboard.rotation.y = Math.PI / 2; // Rotate 90 degrees to align with court width
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  scene.add(backboard);

  // Orange rim (torus)
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 }); // Orange color
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(-14.1, 6.8, 0); // Slightly lower position on the backboard
  rim.rotation.x = Math.PI / 2; // Rotate to make rim horizontal
  rim.castShadow = true;
  scene.add(rim);

  // Net - made from line segments
  const netSegments = 12; // More than 8 as requested
  const netHeight = 1.5;
  const netRadius = 0.9;
  
  // Vertical lines of the net
  for (let i = 0; i < netSegments; i++) {
    const angle = (i / netSegments) * 2 * Math.PI;
    const x = Math.cos(angle) * netRadius;
    const z = Math.sin(angle) * netRadius;
    
    const netLineGeometry = new THREE.BufferGeometry();
    const netLineVertices = new Float32Array([
      x, 0, z,
      x, -netHeight, z
    ]);
    netLineGeometry.setAttribute('position', new THREE.BufferAttribute(netLineVertices, 3));
    
    const netLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const netLine = new THREE.Line(netLineGeometry, netLineMaterial);
    netLine.position.set(-14.1, 6.8, 0);
    scene.add(netLine);
  }
  
  // Horizontal rings of the net
  for (let ring = 1; ring <= 4; ring++) {
    const ringHeight = -(ring * netHeight / 5);
    const ringRadius = netRadius * (1 - ring / 5);
    
    const ringGeometry = new THREE.BufferGeometry();
    const ringPoints = [];
    for (let i = 0; i <= netSegments; i++) {
      const angle = (i / netSegments) * 2 * Math.PI;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      ringPoints.push(x, ringHeight, z);
    }
    ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringPoints), 3));
    
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const ringLine = new THREE.Line(ringGeometry, ringMaterial);
    ringLine.position.set(-14.1, 6.8, 0);
    scene.add(ringLine);
  }

  // Support pole behind the backboard
  const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 }); // Dark gray
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(-15.3, 4, 0); // Closer to the backboard
  pole.castShadow = true;
  scene.add(pole);
}

// Create second basketball hoop at opposite end
function createSecondBasketballHoop() {
  // Backboard - white semi-transparent rectangular
  const backboardGeometry = new THREE.BoxGeometry(4, 3, 0.1);
  const backboardMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.8 
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  backboard.position.set(15, 8, 0); // Position at right side of court
  backboard.rotation.y = -Math.PI / 2; // Rotate -90 degrees to face the opposite direction
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  scene.add(backboard);

  // Orange rim (torus)
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 }); // Orange color
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(14.1, 6.8, 0); // Position in front of backboard on right side
  rim.rotation.x = Math.PI / 2; // Rotate to make rim horizontal
  rim.castShadow = true;
  scene.add(rim);

  // Net - made from line segments
  const netSegments = 12;
  const netHeight = 1.5;
  const netRadius = 0.9;
  
  // Vertical lines of the net
  for (let i = 0; i < netSegments; i++) {
    const angle = (i / netSegments) * 2 * Math.PI;
    const x = Math.cos(angle) * netRadius;
    const z = Math.sin(angle) * netRadius;
    
    const netLineGeometry = new THREE.BufferGeometry();
    const netLineVertices = new Float32Array([
      x, 0, z,
      x, -netHeight, z
    ]);
    netLineGeometry.setAttribute('position', new THREE.BufferAttribute(netLineVertices, 3));
    
    const netLineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const netLine = new THREE.Line(netLineGeometry, netLineMaterial);
    netLine.position.set(14.1, 6.8, 0);
    scene.add(netLine);
  }
  
  // Horizontal rings of the net
  for (let ring = 1; ring <= 4; ring++) {
    const ringHeight = -(ring * netHeight / 5);
    const ringRadius = netRadius * (1 - ring / 5);
    
    const ringGeometry = new THREE.BufferGeometry();
    const ringPoints = [];
    for (let i = 0; i <= netSegments; i++) {
      const angle = (i / netSegments) * 2 * Math.PI;
      const x = Math.cos(angle) * ringRadius;
      const z = Math.sin(angle) * ringRadius;
      ringPoints.push(x, ringHeight, z);
    }
    ringGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ringPoints), 3));
    
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const ringLine = new THREE.Line(ringGeometry, ringMaterial);
    ringLine.position.set(14.1, 6.8, 0);
    scene.add(ringLine);
  }

  // Support pole behind the backboard
  const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 }); // Dark gray
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(15.3, 4, 0); // Behind the backboard on right side
  pole.castShadow = true;
  scene.add(pole);
}

// Create basketball at center court
function createBasketball() {
  // Basketball sphere
  const basketballGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const basketballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff8c00,  // Orange color
    shininess: 30
  });
  const basketball = new THREE.Mesh(basketballGeometry, basketballMaterial);
  basketball.position.set(0, 0.8, 0); // Position at center court, slightly above surface
  basketball.castShadow = true;
  basketball.receiveShadow = true;
  scene.add(basketball);

  // Basketball seams - create realistic seam pattern
  const ballRadius = 0.8;
  
  // Main vertical seams (longitudinal lines)
  const verticalSeams = 4;
  for (let i = 0; i < verticalSeams; i++) {
    const angle = (i / verticalSeams) * 2 * Math.PI;
    
    // Create curved seam that follows the sphere
    const seamPoints = [];
    const segments = 32;
    for (let j = 0; j <= segments; j++) {
      const phi = (j / segments) * Math.PI - Math.PI / 2; // Latitude from -90 to 90 degrees
      const x = ballRadius * Math.cos(phi) * Math.cos(angle);
      const y = ballRadius * Math.sin(phi);
      const z = ballRadius * Math.cos(phi) * Math.sin(angle);
      seamPoints.push(x, y, z);
    }
    
    const seamGeometry = new THREE.BufferGeometry();
    seamGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(seamPoints), 3));
    
    const seamMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const seam = new THREE.Line(seamGeometry, seamMaterial);
    seam.position.set(0, 0.8, 0);
    scene.add(seam);
  }

  // Horizontal seams (latitudinal lines) - create the classic basketball pattern
  const horizontalSeamHeights = [-0.4, 0, 0.4]; // Three horizontal seams
  for (let height of horizontalSeamHeights) {
    const radius = Math.sqrt(ballRadius * ballRadius - height * height);
    
    const horizontalSeamPoints = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      horizontalSeamPoints.push(x, height, z);
    }
    
    const horizontalSeamGeometry = new THREE.BufferGeometry();
    horizontalSeamGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(horizontalSeamPoints), 3));
    
    const horizontalSeamMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const horizontalSeam = new THREE.Line(horizontalSeamGeometry, horizontalSeamMaterial);
    horizontalSeam.position.set(0, 0.8, 0);
    scene.add(horizontalSeam);
  }

  // Additional curved seams for more realistic basketball pattern
  const curvedSeams = 4;
  for (let i = 0; i < curvedSeams; i++) {
    const angle = (i / curvedSeams) * 2 * Math.PI + Math.PI / 4; // Offset by 45 degrees
    
    // Create curved seam that goes from one pole to the other with a curve
    const seamPoints = [];
    const segments = 32;
    for (let j = 0; j <= segments; j++) {
      const phi = (j / segments) * Math.PI - Math.PI / 2;
      const curveOffset = Math.sin(phi * 2) * 0.1; // Add curve to the seam
      const adjustedAngle = angle + curveOffset;
      
      const x = ballRadius * Math.cos(phi) * Math.cos(adjustedAngle);
      const y = ballRadius * Math.sin(phi);
      const z = ballRadius * Math.cos(phi) * Math.sin(adjustedAngle);
      seamPoints.push(x, y, z);
    }
    
    const seamGeometry = new THREE.BufferGeometry();
    seamGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(seamPoints), 3));
    
    const seamMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
    const seam = new THREE.Line(seamGeometry, seamMaterial);
    seam.position.set(0, 0.8, 0);
    scene.add(seam);
  }
}

createBasketballCourt();
createBasketballHoop();
createSecondBasketballHoop();
createBasketball();

// Set camera position to show the whole court
camera.position.set(0, 20, 25);
camera.lookAt(0, 0, 0);

// Setup OrbitControls with better configuration
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10; // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground
controls.target.set(0, 5, 0); // Look at center of court, slightly above ground

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
  <p>Mouse - Rotate camera (when enabled)</p>
  <p>Scroll - Zoom in/out</p>
`;
document.body.appendChild(instructionsElement);

document.addEventListener('keydown', (e) => {
  if (e.key === "o" || e.key === "O") {
    isOrbitEnabled = !isOrbitEnabled;
    console.log('Orbit controls:', isOrbitEnabled ? 'enabled' : 'disabled');
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();
  renderer.render(scene, camera);
}

animate();
