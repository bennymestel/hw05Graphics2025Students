import { OrbitControls } from './OrbitControls.js';

let basketball;
// References to rim and backboard meshes for collision
let leftRim = null, rightRim = null;
let leftBackboard = null, rightBackboard = null;
// Reference to the 3D scoreboard canvas/context/texture
let scoreboardCanvas, scoreboardContext, scoreboardTexture;

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
  leftBackboard = backboard; // Store reference

  // --- Backboard collision region matches mesh (no visual helper) ---
  // const bbWidth = 4, bbHeight = 3, bbY = 8, bbZ = 0;
  // const leftBBMin = new THREE.Vector3(-15 - 0.05, bbY - bbHeight/2, bbZ - bbWidth/2);
  // const leftBBMax = new THREE.Vector3(-15 + 0.05, bbY + bbHeight/2, bbZ + bbWidth/2);
  // const leftBBBox = new THREE.Box3(leftBBMin, leftBBMax);
  // (No Box3Helper)

  // Orange rim (torus) for the basketball hoop
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(-14.1, 6.8, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  scene.add(rim);
  leftRim = rim; // Store reference

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
  rightBackboard = backboard; // Store reference

  // --- Backboard collision region matches mesh (no visual helper) ---
  // const bbWidth = 4, bbHeight = 3, bbY = 8, bbZ = 0;
  // const rightBBMin = new THREE.Vector3(15 - 0.05, bbY - bbHeight/2, bbZ - bbWidth/2);
  // const rightBBMax = new THREE.Vector3(15 + 0.05, bbY + bbHeight/2, bbZ + bbWidth/2);
  // const rightBBBox = new THREE.Box3(rightBBMin, rightBBMax);
  // (No Box3Helper)

  // Orange rim (torus) for the basketball hoop
  const rimGeometry = new THREE.TorusGeometry(0.9, 0.1, 8, 16);
  const rimMaterial = new THREE.MeshPhongMaterial({ color: 0xff8c00 });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.set(14.1, 6.8, 0);
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  scene.add(rim);
  rightRim = rim; // Store reference

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
  // Basketball group to hold sphere and seams
  basketball = new THREE.Group();

  // Basketball sphere - orange with realistic material properties
  const basketballGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const basketballMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xff8c00,  // Orange color matching real basketballs
    shininess: 30     // Moderate shininess for realistic appearance
  });
  const basketballMesh = new THREE.Mesh(basketballGeometry, basketballMaterial);
  basketballMesh.position.set(0, 0, 0); // Centered in group
  basketballMesh.castShadow = true;
  basketballMesh.receiveShadow = true;
  basketball.add(basketballMesh);

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
    seam.position.set(0, 0, 0); // Centered in group
    basketball.add(seam);
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
    horizontalSeam.position.set(0, 0, 0); // Centered in group
    basketball.add(horizontalSeam);
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
    seam.position.set(0, 0, 0); // Centered in group
    basketball.add(seam);
  }

  // Set initial position of the group (center court, slightly above surface)
  basketball.position.set(0, 0.8, 0);
  basketball.castShadow = true;
  basketball.receiveShadow = true;
  scene.add(basketball);
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
  scoreboardCanvas = document.createElement('canvas');
  scoreboardContext = scoreboardCanvas.getContext('2d');
  scoreboardCanvas.width = 512;
  scoreboardCanvas.height = 256;
  // Initial draw
  scoreboardContext.fillStyle = '#1a1a1a';
  scoreboardContext.fillRect(0, 0, scoreboardCanvas.width, scoreboardCanvas.height);
  scoreboardContext.fillStyle = '#ff8c00';
  scoreboardContext.font = 'bold 48px Arial';
  scoreboardContext.textAlign = 'center';
  scoreboardContext.textBaseline = 'middle';
  scoreboardContext.fillText('HOME', scoreboardCanvas.width / 4, scoreboardCanvas.height / 4);
  scoreboardContext.fillText('GUEST', (scoreboardCanvas.width / 4) * 3, scoreboardCanvas.height / 4);
  scoreboardContext.font = 'bold 96px Arial';
  scoreboardContext.fillText('00', scoreboardCanvas.width / 4, (scoreboardCanvas.height / 2) + 20);
  scoreboardContext.fillText('00', (scoreboardCanvas.width / 4) * 3, (scoreboardCanvas.height / 2) + 20);
  scoreboardTexture = new THREE.CanvasTexture(scoreboardCanvas);
  const screenMaterial = new THREE.MeshBasicMaterial({ map: scoreboardTexture, side: THREE.DoubleSide });
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

// Track which keys are pressed
const keysPressed = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false
};

// Shot power state
let shotPower = 50; // Start at 50%

// Basketball velocity and gravity
let basketballVelocity = new THREE.Vector3(0, 0, 0);
// Gravity and restitution
const gravity = new THREE.Vector3(0, -0.035, 0); // More realistic gravity
const restitution = 0.4; // Energy loss on bounce
const backboardRestitution = 0.2; // Softer bounce for backboard
let isBallInAir = false;
let score = 0;
let lastScoreHoop = null; // Track which hoop was last scored
let totalShots = 0;
let shotsMade = 0;
let homeScore = 0;
let guestScore = 0;

// Hoop positions (rim center)
const leftHoopPos = new THREE.Vector3(-14.1, 6.8, 0);
const rightHoopPos = new THREE.Vector3(14.1, 6.8, 0);

// Track previous basketball position for robust collision
let prevBallPos = null;

// --- Camera Presets ---
const cameraPresets = [
    { // Default wide view
        position: new THREE.Vector3(0, 20, 30),
        target: new THREE.Vector3(0, 5, 0)
    },
    { // Top-down view
        position: new THREE.Vector3(0, 35, 0),
        target: new THREE.Vector3(0, 0, 0)
    },
    { // Side-court view
        position: new THREE.Vector3(-30, 10, 0),
        target: new THREE.Vector3(0, 5, 0)
    },
    { // Behind-the-hoop view
        position: new THREE.Vector3(-20, 10, 0),
        target: new THREE.Vector3(15, 8, 0) // Look towards the other hoop
    }
];

// Setup OrbitControls for interactive camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable smooth camera movement
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;   // Closer minimum zoom
controls.maxDistance = 60;  // Increased max distance for top-down view
controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground

/**
 * Sets the camera to a predefined preset position and target.
 * @param {number} index The index of the preset in the cameraPresets array.
 */
function setCameraPreset(index) {
    if (index < 0 || index >= cameraPresets.length) return;
    
    const preset = cameraPresets[index];
    // Use GSAP for smooth transition if available, otherwise teleport
    camera.position.copy(preset.position);
    controls.target.copy(preset.target);
}

// Initialize camera to the default preset
setCameraPreset(0);

// Track whether orbit controls are enabled
let isOrbitEnabled = true;

// Create on-screen instructions for user controls
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
instructionsElement.style.padding = '10px';
instructionsElement.style.borderRadius = '5px';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
  <h3>Controls:</h3>
  <p><b>1-4:</b> Camera Presets</p>
  <p><b>O:</b> Toggle Orbit Camera</p>
  <p><b>Mouse:</b> Rotate (when enabled)</p>
  <p><b>Scroll:</b> Zoom</p>
`;
document.body.appendChild(instructionsElement);

// Handle keyboard input for toggling orbit controls and camera presets
document.addEventListener('keydown', (e) => {
  // Use a switch statement for cleaner key handling
  switch (e.key.toLowerCase()) {
    case 'o':
      isOrbitEnabled = !isOrbitEnabled;
      // console.log('Orbit controls:', isOrbitEnabled ? 'enabled' : 'disabled');
      break;
    case '1':
      setCameraPreset(0);
      break;
    case '2':
      setCameraPreset(1);
      break;
    case '3':
      setCameraPreset(2);
      break;
    case '4':
      setCameraPreset(3);
      break;
  }
});

// Keyboard event listeners for basketball movement and shot power
window.addEventListener('keydown', (e) => {
  if (e.key in keysPressed) {
    keysPressed[e.key] = true;
  }
  // Shot power controls
  if (e.key.toLowerCase() === 'w') {
    shotPower = Math.min(100, shotPower + 5);
    updateShotPowerDisplay();
  }
  if (e.key.toLowerCase() === 's') {
    shotPower = Math.max(0, shotPower - 5);
    updateShotPowerDisplay();
  }
  // Reset basketball position with R key
  if (e.key.toLowerCase() === 'r') {
    if (basketball) {
      basketball.position.set(0, 0.8, 0);
      basketballVelocity.set(0, 0, 0);
      isBallInAir = false;
      shotPower = 50;
      updateShotPowerDisplay();
    }
  }
  // Shoot with spacebar if not already in air
  if (e.code === 'Space' && !isBallInAir) {
    totalShots++;
    updateScoreDisplay();
    // --- PHYSICS-BASED SHOT ARC ---
    // 1. Find the nearest hoop
    const ballPos = basketball.position.clone();
    const distToLeft = ballPos.distanceTo(leftHoopPos);
    const distToRight = ballPos.distanceTo(rightHoopPos);
    const targetHoop = distToLeft < distToRight ? leftHoopPos : rightHoopPos;
    // 2. Set apex height above rim
    const rimY = targetHoop.y;
    const apexY = Math.max(ballPos.y, rimY + 1.5); // 1.5 units above rim
    // 3. Calculate time to apex and from apex to rim
    const g = Math.abs(gravity.y); // positive gravity value
    const dy1 = apexY - ballPos.y;
    const dy2 = apexY - rimY;
    // Time to rise to apex
    const t1 = Math.sqrt(2 * dy1 / g);
    // Time to fall from apex to rim
    const t2 = Math.sqrt(2 * dy2 / g);
    const totalTime = t1 + t2;
    // 4. Initial vertical velocity to reach apex
    const vy = g * t1;
    // 5. Horizontal (XZ) velocity to reach hoop in totalTime
    const dx = targetHoop.x - ballPos.x;
    const dz = targetHoop.z - ballPos.z;
    const vx = dx / totalTime;
    const vz = dz / totalTime;
    // 6. Combine into velocity vector
    let velocity = new THREE.Vector3(vx, vy, vz);
    // 7. Scale velocity by shot power (power 50 = normal, <50 = slower/higher arc, >50 = faster/lower arc)
    const powerScale = 0.5 + shotPower / 100; // 0.5 (min) to 1.5 (max)
    velocity.multiplyScalar(powerScale);
    basketballVelocity.copy(velocity);
    // 8. Start flight simulation
    isBallInAir = true;
    lastScoreHoop = null; // Reset score detection
  }
});
window.addEventListener('keyup', (e) => {
  if (e.key in keysPressed) {
    keysPressed[e.key] = false;
  }
});

// Display shot power on screen
const shotPowerElement = document.createElement('div');
shotPowerElement.style.position = 'absolute';
shotPowerElement.style.top = '20px';
shotPowerElement.style.left = '20px';
shotPowerElement.style.color = 'white';
shotPowerElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
shotPowerElement.style.padding = '10px';
shotPowerElement.style.borderRadius = '5px';
shotPowerElement.style.fontSize = '16px';
shotPowerElement.style.fontFamily = 'Arial, sans-serif';
shotPowerElement.style.textAlign = 'left';
shotPowerElement.innerHTML = `<b>Shot Power:</b> <span id="shot-power-value">${shotPower}%</span><br><b>W/S:</b> Increase/Decrease`;
document.body.appendChild(shotPowerElement);

function updateShotPowerDisplay() {
  shotPowerElement.innerHTML = `<b>Shot Power:</b> <span id="shot-power-value">${shotPower}%</span><br><b>W/S:</b> Increase/Decrease`;
}

// Remove the old scoreElement and use a single merged scoreboard
const scoreboardElement = document.createElement('div');
scoreboardElement.style.position = 'absolute';
scoreboardElement.style.top = '20px';
scoreboardElement.style.right = '20px';
scoreboardElement.style.color = 'white';
scoreboardElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
scoreboardElement.style.padding = '18px 28px 18px 28px';
scoreboardElement.style.borderRadius = '10px';
scoreboardElement.style.fontSize = '20px';
scoreboardElement.style.fontFamily = 'Arial, sans-serif';
scoreboardElement.style.textAlign = 'center';
scoreboardElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.3)';
scoreboardElement.innerHTML = `
  <div style="font-size: 26px; font-weight: bold; margin-bottom: 8px; letter-spacing: 2px;">
    <span style="color:#ff8c00">HOME</span> <span id="home-score-value">${homeScore}</span>
    &nbsp;|&nbsp;
    <span style="color:#ff8c00">GUEST</span> <span id="guest-score-value">${guestScore}</span>
  </div>
  <div style="font-size: 16px; margin-top: 8px;">
    <b>Attempts:</b> <span id="attempts-value">${totalShots}</span><br>
    <b>Made:</b> <span id="made-value">${shotsMade}</span><br>
    <b>Shooting %:</b> <span id="percent-value">0%</span>
  </div>
`;
document.body.appendChild(scoreboardElement);

function updateScoreDisplay() {
  const percent = totalShots > 0 ? ((shotsMade / totalShots) * 100).toFixed(1) : '0';
  scoreboardElement.innerHTML = `
    <div style="font-size: 26px; font-weight: bold; margin-bottom: 8px; letter-spacing: 2px;">
      <span style="color:#ff8c00">HOME</span> <span id="home-score-value">${homeScore}</span>
      &nbsp;|&nbsp;
      <span style="color:#ff8c00">GUEST</span> <span id="guest-score-value">${guestScore}</span>
    </div>
    <div style="font-size: 16px; margin-top: 8px;">
      <b>Attempts:</b> <span id="attempts-value">${totalShots}</span><br>
      <b>Made:</b> <span id="made-value">${shotsMade}</span><br>
      <b>Shooting %:</b> <span id="percent-value">${percent}%</span>
    </div>
  `;
  // Update 3D scoreboard if available
  if (scoreboardContext && scoreboardTexture) {
    scoreboardContext.fillStyle = '#1a1a1a';
    scoreboardContext.fillRect(0, 0, scoreboardCanvas.width, scoreboardCanvas.height);
    scoreboardContext.fillStyle = '#ff8c00';
    scoreboardContext.font = 'bold 48px Arial';
    scoreboardContext.textAlign = 'center';
    scoreboardContext.textBaseline = 'middle';
    scoreboardContext.fillText('HOME', scoreboardCanvas.width / 4, scoreboardCanvas.height / 4);
    scoreboardContext.fillText('GUEST', (scoreboardCanvas.width / 4) * 3, scoreboardCanvas.height / 4);
    scoreboardContext.font = 'bold 96px Arial';
    scoreboardContext.fillText(homeScore.toString().padStart(2, '0'), scoreboardCanvas.width / 4, (scoreboardCanvas.height / 2) + 20);
    scoreboardContext.fillText(guestScore.toString().padStart(2, '0'), (scoreboardCanvas.width / 4) * 3, (scoreboardCanvas.height / 2) + 20);
    scoreboardTexture.needsUpdate = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.enabled = isOrbitEnabled;
  controls.update();

  // Basketball movement speed (units per frame)
  const moveSpeed = 0.2;
  const ballRadius = 0.8; // Make ballRadius available everywhere in animate
  if (basketball) {
    if (!isBallInAir) {
      let moved = false;
      // Move left/right (x axis)
      if (keysPressed.ArrowLeft) {
        basketball.position.x -= moveSpeed;
        moved = true;
      }
      if (keysPressed.ArrowRight) {
        basketball.position.x += moveSpeed;
        moved = true;
      }
      // Move forward/backward (z axis)
      if (keysPressed.ArrowUp) {
        basketball.position.z -= moveSpeed;
        moved = true;
      }
      if (keysPressed.ArrowDown) {
        basketball.position.z += moveSpeed;
        moved = true;
      }
      // Clamp basketball position to stay within court bounds (entire ball)
      const courtHalfWidth = 15;
      const courtHalfLength = 7.5;
      basketball.position.x = Math.max(-courtHalfWidth + ballRadius, Math.min(courtHalfWidth - ballRadius, basketball.position.x));
      basketball.position.z = Math.max(-courtHalfLength + ballRadius, Math.min(courtHalfLength - ballRadius, basketball.position.z));
      prevBallPos = basketball.position.clone();
    } else {
      // Store previous position before moving
      if (!prevBallPos) prevBallPos = basketball.position.clone();
      const oldPos = prevBallPos.clone();
      basketball.position.add(basketballVelocity);
      basketballVelocity.add(gravity);

      // --- IMPROVED COLLISION DETECTION ---
      [
        {rim: leftRim, backboard: leftBackboard, rimCenter: leftHoopPos, isLeft: true, hoopName: 'left'},
        {rim: rightRim, backboard: rightBackboard, rimCenter: rightHoopPos, isLeft: false, hoopName: 'right'}
      ].forEach(({rim, backboard, rimCenter, isLeft, hoopName}) => {
        if (!rim || !backboard) return;
        // --- Rim collision (solid tube, but allow scoring) ---
        const rimY = rimCenter.y;
        const rimXZ = new THREE.Vector2(rimCenter.x, rimCenter.z);
        const ballXZ = new THREE.Vector2(basketball.position.x, basketball.position.z);
        const distXZ = rimXZ.distanceTo(ballXZ);
        const rimRadius = 0.9;
        const rimTube = 0.1; // Torus tube radius
        const scoringMargin = 0.18; // Allow ball to pass through if inside this margin
        // Only check if ball is near rim height
        if (Math.abs(basketball.position.y - rimY) < ballRadius + rimTube) {
          // Only apply rim collision if ball is outside scoring zone or moving upward
          const inScoringZone = distXZ < rimRadius - scoringMargin && basketballVelocity.y < 0;
          if (!inScoringZone && distXZ > rimRadius - (rimTube + ballRadius) && distXZ < rimRadius + (rimTube + ballRadius)) {
            const fromRim = ballXZ.clone().sub(rimXZ).normalize();
            const vXZ = new THREE.Vector2(basketballVelocity.x, basketballVelocity.z);
            const dot = vXZ.dot(fromRim);
            vXZ.sub(fromRim.clone().multiplyScalar(2 * dot));
            basketballVelocity.x = vXZ.x * restitution; // Dampen
            basketballVelocity.z = vXZ.y * restitution;
            const pushOut = rimRadius + (rimTube + ballRadius) + 0.01;
            basketball.position.x = rimCenter.x + fromRim.x * pushOut;
            basketball.position.z = rimCenter.z + fromRim.y * pushOut;
          }
        }
        // --- Backboard collision (robust plane crossing, matches visible mesh) ---
        // Visible backboard mesh: BoxGeometry(4, 3, 0.1), group at (x, 8, 0)
        const backboardX = isLeft ? -15 : 15;
        const bbWidth = 4; // mesh width
        const bbHeight = 3; // mesh height
        const bbY = 8; // mesh center y
        const bbZ = 0; // mesh center z
        // Only check if ball is within visible backboard Y/Z bounds
        if (
          basketball.position.y > bbY - bbHeight/2 && basketball.position.y < bbY + bbHeight/2 &&
          basketball.position.z > bbZ - bbWidth/2 && basketball.position.z < bbZ + bbWidth/2
        ) {
          const prevX = oldPos.x;
          const currX = basketball.position.x;
          if (isLeft) {
            if (prevX - ballRadius > backboardX && currX - ballRadius <= backboardX && basketballVelocity.x < 0) {
              basketballVelocity.x *= -backboardRestitution;
              basketball.position.x = backboardX - ballRadius;
              // Clamp to court boundaries after backboard collision
              const courtHalfWidth = 15;
              const courtHalfLength = 7.5;
              basketball.position.x = Math.max(-courtHalfWidth + ballRadius, Math.min(courtHalfWidth - ballRadius, basketball.position.x));
              basketball.position.z = Math.max(-courtHalfLength + ballRadius, Math.min(courtHalfLength - ballRadius, basketball.position.z));
            }
          } else {
            if (prevX + ballRadius < backboardX && currX + ballRadius >= backboardX && basketballVelocity.x > 0) {
              basketballVelocity.x *= -backboardRestitution;
              basketball.position.x = backboardX + ballRadius;
              // Clamp to court boundaries after backboard collision
              const courtHalfWidth = 15;
              const courtHalfLength = 7.5;
              basketball.position.x = Math.max(-courtHalfWidth + ballRadius, Math.min(courtHalfWidth - ballRadius, basketball.position.x));
              basketball.position.z = Math.max(-courtHalfLength + ballRadius, Math.min(courtHalfLength - ballRadius, basketball.position.z));
            }
          }
        }
        // --- Score detection: ball passes through hoop from above ---
        if (
          lastScoreHoop !== hoopName &&
          oldPos.y > rimY && basketball.position.y <= rimY &&
          distXZ < rimRadius - rimTube * 0.7 // Must be inside rim, not just touching
        ) {
          score++;
          shotsMade++;
          // Team scoring: left hoop = home, right hoop = guest
          if (isLeft) {
            homeScore += 2;
          } else {
            guestScore += 2;
          }
          updateScoreDisplay();
          lastScoreHoop = hoopName;
          // Make the ball fall straight down after scoring
          basketballVelocity.x = 0;
          basketballVelocity.z = 0;
          // Set X to rim's X so it falls in front of the basket
          basketball.position.x = rimCenter.x;
          // Clamp to court boundaries after scoring
          const courtHalfWidth = 15;
          const courtHalfLength = 7.5;
          basketball.position.x = Math.max(-courtHalfWidth + ballRadius, Math.min(courtHalfWidth - ballRadius, basketball.position.x));
          basketball.position.z = Math.max(-courtHalfLength + ballRadius, Math.min(courtHalfLength - ballRadius, basketball.position.z));
        }
      });

      // --- Ball-to-ground collision with bounce mechanics ---
      if (basketball.position.y <= 0.8) {
        basketball.position.y = 0.8;
        if (Math.abs(basketballVelocity.y) > 0.1) {
          basketballVelocity.y *= -restitution;
          // Dampen horizontal velocity slightly on ground bounce
          basketballVelocity.x *= 0.8;
          basketballVelocity.z *= 0.8;
        } else {
          basketballVelocity.set(0, 0, 0);
          isBallInAir = false;
        }
      }
      // Ball comes to rest if velocity is very small
      if (basketballVelocity.length() < 0.05 && basketball.position.y <= 0.81) {
        basketballVelocity.set(0, 0, 0);
        isBallInAir = false;
      }
      // Update previous position for next frame
      prevBallPos = basketball.position.clone();

      // --- Ball rotation during movement ---
      if (basketballVelocity.length() > 0.01) {
        // Axis perpendicular to velocity and up (Y)
        const velocityDir = basketballVelocity.clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const axis = new THREE.Vector3().crossVectors(velocityDir, up).normalize();
        // Rotation amount proportional to velocity
        const rotationSpeed = basketballVelocity.length() * 0.07; // Tweak factor for realism
        if (!isNaN(axis.x) && !isNaN(axis.y) && !isNaN(axis.z)) {
          basketball.rotateOnAxis(axis, rotationSpeed);
        }
      }
    }
  }

  renderer.render(scene, camera);
}

animate();
