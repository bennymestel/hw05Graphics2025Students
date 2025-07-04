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

// Enhanced lighting setup with multiple light sources
// Point light at center court
const centerPointLight = new THREE.PointLight(0xffffff, 0.4, 25);
centerPointLight.position.set(0, 10, 0);
centerPointLight.castShadow = true;
centerPointLight.shadow.mapSize.width = 512;
centerPointLight.shadow.mapSize.height = 512;
scene.add(centerPointLight);

// Spot lights above each hoop
const leftSpotLight = new THREE.SpotLight(0xffffff, 0.6, 20, Math.PI / 3, 0.3, 1);
leftSpotLight.position.set(-15, 12, 0);
leftSpotLight.target.position.set(-15, 0, 0);
leftSpotLight.castShadow = true;
leftSpotLight.shadow.mapSize.width = 512;
leftSpotLight.shadow.mapSize.height = 512;
scene.add(leftSpotLight);
scene.add(leftSpotLight.target);

const rightSpotLight = new THREE.SpotLight(0xffffff, 0.6, 20, Math.PI / 3, 0.3, 1);
rightSpotLight.position.set(15, 12, 0);
rightSpotLight.target.position.set(15, 0, 0);
rightSpotLight.castShadow = true;
rightSpotLight.shadow.mapSize.width = 512;
rightSpotLight.shadow.mapSize.height = 512;
scene.add(rightSpotLight);
scene.add(rightSpotLight.target);

// Additional point lights for corners
const cornerLight1 = new THREE.PointLight(0xffffff, 0.3, 15);
cornerLight1.position.set(-12, 8, -6);
cornerLight1.castShadow = true;
scene.add(cornerLight1);

const cornerLight2 = new THREE.PointLight(0xffffff, 0.3, 15);
cornerLight2.position.set(12, 8, -6);
cornerLight2.castShadow = true;
scene.add(cornerLight2);

const cornerLight3 = new THREE.PointLight(0xffffff, 0.3, 15);
cornerLight3.position.set(-12, 8, 6);
cornerLight3.castShadow = true;
scene.add(cornerLight3);

const cornerLight4 = new THREE.PointLight(0xffffff, 0.3, 15);
cornerLight4.position.set(12, 8, 6);
cornerLight4.castShadow = true;
scene.add(cornerLight4);

// Warm fill light for atmosphere
const warmFillLight = new THREE.DirectionalLight(0xfff4e6, 0.2);
warmFillLight.position.set(0, 15, 10);
scene.add(warmFillLight);

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
  threePointArc2.rotation.x = -Math.PI / 2; // Lay flat on court
  scene.add(threePointArc2);

  // --- Free-Throw Lines ---

  // Free-throw line for the left hoop
  const ftLineLeftGeo = new THREE.BufferGeometry();
  const ftLineLeftVertices = new Float32Array([
    -10, 0, -3, // Start point
    -10, 0, 3   // End point
  ]);
  ftLineLeftGeo.setAttribute('position', new THREE.BufferAttribute(ftLineLeftVertices, 3));
  const ftLineLeft = new THREE.Line(ftLineLeftGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));
  ftLineLeft.position.y = 0.01; // Position slightly above the court
  scene.add(ftLineLeft);

  // Free-throw line for the right hoop
  const ftLineRightGeo = new THREE.BufferGeometry();
  const ftLineRightVertices = new Float32Array([
    10, 0, -3, // Start point
    10, 0, 3   // End point
  ]);
  ftLineRightGeo.setAttribute('position', new THREE.BufferAttribute(ftLineRightVertices, 3));
  const ftLineRight = new THREE.Line(ftLineRightGeo, new THREE.LineBasicMaterial({ color: 0xffffff }));
  ftLineRight.position.y = 0.01; // Position slightly above the court
  scene.add(ftLineRight);
}

// Create the first basketball hoop (left side of court)
function createBasketballHoop() {
  // Create and position the branded backboard
  const backboard = createBrandedBackboard();
  backboard.position.set(-15, 8, 0); // Position at left side of court
  backboard.rotation.y = Math.PI / 2; // Rotate to face the court
  scene.add(backboard);

  // Orange rim (torus) for the basketball hoop
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(-14.1, 6.8, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  scene.add(rim);

  // Create and position the chain net
  const chainNet = createChainNet();
  chainNet.position.set(-14.1, 6.8, 0); // Position under the rim
  scene.add(chainNet);

  // Support pole behind the backboard
  const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(-15.3, 4, 0);
  pole.castShadow = true;
  scene.add(pole);

  // Support arm connecting pole to backboard
  const supportArmGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
  const supportArmMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const supportArm = new THREE.Mesh(supportArmGeometry, supportArmMaterial);
  supportArm.position.set(-15.15, 7.7, 0);
  supportArm.rotation.z = Math.PI / 2;
  supportArm.castShadow = true;
  scene.add(supportArm);
}

// Create the second basketball hoop (right side of court)
function createSecondBasketballHoop() {
  // Create and position the branded backboard
  const backboard = createBrandedBackboard();
  backboard.position.set(15, 8, 0); // Position at right side of court
  backboard.rotation.y = -Math.PI / 2; // Rotate to face the court
  scene.add(backboard);

  // Orange rim (torus) for the basketball hoop
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(14.1, 6.8, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  scene.add(rim);

  // Create and position the chain net
  const chainNet = createChainNet();
  chainNet.position.set(14.1, 6.8, 0); // Position under the rim
  scene.add(chainNet);

  // Support pole behind the backboard
  const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
  const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(15.3, 4, 0);
  pole.castShadow = true;
  scene.add(pole);

  // Support arm connecting pole to backboard
  const supportArmGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
  const supportArmMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const supportArm = new THREE.Mesh(supportArmGeometry, supportArmMaterial);
  supportArm.position.set(15.15, 7.85, 0);
  supportArm.rotation.z = -Math.PI / 2;
  supportArm.castShadow = true;
  scene.add(supportArm);
}

// Create a realistic basketball at center court
function createBasketball() {
  // Basketball sphere - orange with realistic material properties
  const basketballGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const basketballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff8c00,  // Orange color matching real basketballs
    shininess: 30     // Moderate shininess for realistic appearance
  });
  const basketball = new THREE.Mesh(basketballGeometry, basketballMaterial);
  basketball.position.set(0, 0.8, 0); // Position at center court, slightly above surface
  basketball.castShadow = true;
  basketball.receiveShadow = true;
  scene.add(basketball);

  // Basketball seams - create realistic seam pattern
  const ballRadius = 0.8; // Radius of the basketball
  
  // Main vertical seams (longitudinal lines) - create curved seams that follow the sphere
  const verticalSeams = 4;
  for (let i = 0; i < verticalSeams; i++) {
    const angle = (i / verticalSeams) * 2 * Math.PI;
    
    // Create curved seam that follows the spherical surface
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
    seam.position.set(0, 0.8, 0); // Position at basketball center
    scene.add(seam);
  }

  // Horizontal seams (latitudinal lines) - create the classic basketball pattern
  const horizontalSeamHeights = [-0.4, 0, 0.4]; // Three horizontal seams at different heights
  for (let height of horizontalSeamHeights) {
    const radius = Math.sqrt(ballRadius * ballRadius - height * height); // Calculate radius at this height
    
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
    horizontalSeam.position.set(0, 0.8, 0); // Position at basketball center
    scene.add(horizontalSeam);
  }

  // Additional curved seams for more realistic basketball pattern
  const curvedSeams = 4;
  for (let i = 0; i < curvedSeams; i++) {
    const angle = (i / curvedSeams) * 2 * Math.PI + Math.PI / 4; // Offset by 45 degrees
    
    // Create curved seam that goes from one pole to the other with a subtle curve
    const seamPoints = [];
    const segments = 32;
    for (let j = 0; j <= segments; j++) {
      const phi = (j / segments) * Math.PI - Math.PI / 2;
      const curveOffset = Math.sin(phi * 2) * 0.1; // Add subtle curve to the seam
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
    seam.position.set(0, 0.8, 0); // Position at basketball center
    scene.add(seam);
  }
}

// Create scoreboard and bleachers for atmosphere
function createAtmosphere() {
  // Scoreboard
  const scoreboardGeometry = new THREE.BoxGeometry(8, 4, 1);
  const scoreboardMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const scoreboard = new THREE.Mesh(scoreboardGeometry, scoreboardMaterial);
  scoreboard.position.set(0, 12, -12);
  scoreboard.castShadow = true;
  scoreboard.receiveShadow = true;
  scene.add(scoreboard);

  // Create a canvas for the scoreboard texture
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 256;

  // Style the scoreboard text
  context.fillStyle = '#1a1a1a'; // Dark background
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ff8c00'; // Orange text
  context.font = 'bold 48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Draw team names and scores
  context.fillText('HOME', canvas.width / 4, canvas.height / 4);
  context.fillText('GUEST', (canvas.width / 4) * 3, canvas.height / 4);
  context.font = 'bold 96px Arial';
  context.fillText('00', canvas.width / 4, (canvas.height / 2) + 20);
  context.fillText('00', (canvas.width / 4) * 3, (canvas.height / 2) + 20);

  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  
  // Scoreboard screen
  const screenGeometry = new THREE.PlaneGeometry(7.5, 3.75);
  const screen = new THREE.Mesh(screenGeometry, screenMaterial);
  screen.position.set(0, 12, -11.45); // Position on the front of the scoreboard
  scene.add(screen);

  // Bleachers - left side (behind court)
  for (let row = 0; row < 5; row++) {
    const bleacherGeometry = new THREE.BoxGeometry(20, 0.5, 2);
    const bleacherMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
    bleacher.position.set(0, row * 1.5, -10 - row * 2);
    bleacher.castShadow = true;
    bleacher.receiveShadow = true;
    scene.add(bleacher);
  }

  // Bleachers - right side (behind scoreboard)
  for (let row = 0; row < 3; row++) {
    const bleacherGeometry = new THREE.BoxGeometry(20, 0.5, 2);
    const bleacherMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
    bleacher.position.set(0, row * 1.5, -20 - row * 2);
    bleacher.castShadow = true;
    bleacher.receiveShadow = true;
    scene.add(bleacher);
  }

  // Bleachers - front side (opposite scoreboard)
  for (let row = 0; row < 4; row++) {
    const bleacherGeometry = new THREE.BoxGeometry(20, 0.5, 2);
    const bleacherMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
    bleacher.position.set(0, row * 1.5, 10 + row * 2);
    bleacher.castShadow = true;
    bleacher.receiveShadow = true;
    scene.add(bleacher);
  }

  // Bleachers - left side of court
  for (let row = 0; row < 3; row++) {
    const bleacherGeometry = new THREE.BoxGeometry(8, 0.5, 2);
    const bleacherMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
    bleacher.position.set(-20 - row * 1.5, row * 1.5, row * 1.5); // Higher rows further from court
    bleacher.rotation.y = Math.PI / 2; // Rotate to face the court
    bleacher.castShadow = true;
    bleacher.receiveShadow = true;
    scene.add(bleacher);
  }

  // Bleachers - right side of court
  for (let row = 0; row < 3; row++) {
    const bleacherGeometry = new THREE.BoxGeometry(8, 0.5, 2);
    const bleacherMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
    bleacher.position.set(20 + row * 1.5, row * 1.5, row * 1.5); // Higher rows further from court
    bleacher.rotation.y = -Math.PI / 2; // Rotate to face the court
    bleacher.castShadow = true;
    bleacher.receiveShadow = true;
    scene.add(bleacher);
  }
}

// -- Helper functions for creating detailed hoop components --

/**
 * Creates a branded backboard with a shooter's square and a logo.
 * @returns {THREE.Group} A group containing the backboard and its branding.
 */
function createBrandedBackboard() {
  const backboardGroup = new THREE.Group();

  // Main backboard plane (semi-transparent)
  const backboardGeometry = new THREE.BoxGeometry(4, 3, 0.1);
  const backboardMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.75
  });
  const backboard = new THREE.Mesh(backboardGeometry, backboardMaterial);
  backboard.castShadow = true;
  backboard.receiveShadow = true;
  backboardGroup.add(backboard);

  // Branding via Canvas Texture
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 192; // 4:3 aspect ratio

  // Draw the shooter's square (inner box)
  context.strokeStyle = '#ff0000'; // Red outline
  context.lineWidth = 8;
  context.strokeRect(canvas.width * 0.25, canvas.height * 0.2, canvas.width * 0.5, canvas.height * 0.4);
  
  // Draw a brand logo
  context.fillStyle = 'rgba(0, 0, 0, 0.8)';
  context.font = 'bold 24px Arial';
  context.textAlign = 'center';
  context.fillText("BENNY'S-HOOPS", canvas.width / 2, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const brandingMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  const brandingPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 2.85), // Slightly smaller than the backboard
    brandingMaterial
  );

  // Position on the front face of the backboard
  brandingPlane.position.z = 0.06;
  backboardGroup.add(brandingPlane);

  return backboardGroup;
}

/**
 * Creates a realistic chain net using small torus geometries.
 * @returns {THREE.Group} A group containing all the chain links of the net.
 */
function createChainNet() {
  const netGroup = new THREE.Group();
  const netMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 90 });

  const numStrands = 12;
  const linksPerStrand = 10;
  const linkRadius = 0.04;
  const linkTube = 0.01;
  const rimRadius = 0.9;
  const netHeight = 1.2;

  for (let i = 0; i < numStrands; i++) {
    const angle = (i / numStrands) * Math.PI * 2;

    for (let j = 0; j < linksPerStrand; j++) {
      const link = new THREE.Mesh(
        new THREE.TorusGeometry(linkRadius, linkTube, 8, 16),
        netMaterial
      );

      // Taper the net downwards
      const taper = 1.0 - 0.4 * (j / linksPerStrand);
      const x = rimRadius * taper * Math.cos(angle);
      const y = -j * (netHeight / linksPerStrand) - linkRadius;
      const z = rimRadius * taper * Math.sin(angle);

      link.position.set(x, y, z);
      link.rotation.x = Math.PI / 2; // Orient links to hang down

      // Alternate link rotation for a chain effect
      if (j % 2 !== 0) {
        link.rotation.z = Math.PI / 2;
      }

      netGroup.add(link);
    }
  }
  return netGroup;
}

createBasketballCourt();
createBasketballHoop();
createSecondBasketballHoop();
createBasketball();
createAtmosphere();

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
