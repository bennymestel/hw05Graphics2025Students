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

createBasketballCourt();
createBasketballHoop();
createSecondBasketballHoop();

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
