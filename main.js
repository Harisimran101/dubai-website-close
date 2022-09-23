import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/PointerLockControls.js';

const objects = [];
let raycaster;
let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let canJump = false;

			let prevTime = performance.now();
			const velocity = new THREE.Vector3();
			const direction = new THREE.Vector3();
			const vertex = new THREE.Vector3();
			const color = new THREE.Color();

const scene = new THREE.Scene();
scene.background = new THREE.Color('white')

const directionalLight = new THREE.DirectionalLight( 'white', 0.5 );
scene.add( directionalLight );

			const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 2000 );

			const renderer = new THREE.WebGLRenderer({
        antialias: true
      });
			renderer.setSize( window.innerWidth, window.innerHeight );
	    renderer.toneMapping = THREE.ACESFilmicToneMapping;
		  renderer.toneMappingExposure = 0.7;
			renderer.outputEncoding = THREE.sRGBEncoding;
			document.body.appendChild( renderer.domElement );

	window.addEventListener('resize', function()

	{

	renderer.setSize( window.innerWidth,  window.innerHeight );
	camera.aspect =  window.innerWidth /  window.innerHeight;
	camera.updateProjectionMatrix();
	} );


// 	const controls = new OrbitControls( camera, renderer.domElement );
// controls.maxDistance = 110;
// controls.minDistance = 2;
// controls.enableDamping = true;
// controls.dampingFactor = 0.035
// controls.maxPolarAngle = Math.PI /2.2

// const controls = new FirstPersonControls( camera, renderer.domElement );
// 				controls.movementSpeed = 25;
// 				controls.lookSpeed = 0.1;

// const controls = new PointerLockControls( camera, document.body );

CameraControls.install( { THREE: THREE } );

new RGBELoader().load('https://assets.codepen.io/7014830/studio.hdr',function(texture){
texture.mapping = THREE.EquirectangularReflectionMapping;
 scene.background = texture
   scene.environment = texture;
})

const loader = new GLTFLoader();
loader.load('model.glb', (gltf) =>{
   const model = gltf.scene;
   scene.add(model);
  model.scale.set(0.65,0.65,0.65)

 //objects.push(scene.getObjectByName('train_station'))

  
})




			camera.position.set(0,25,30)


			const cameraState = {
				mousePos: new THREE.Vector2(0, 0),
				virtualMousePos: new THREE.Vector2(0, 0),
				cameraAngle: [
					new THREE.Vector3(250, 145, 0),
					new THREE.Vector3(250, 145, 0),
					new THREE.Vector3(200, 145, 0),
					new THREE.Vector3(200, 100, 0),
					new THREE.Vector3(200, 100, 0),
					new THREE.Vector3(200, 100, 0),
					new THREE.Vector3(130, 50, 0),
					new THREE.Vector3(100, 40, 0),
					new THREE.Vector3(60, 30, 0),
				],
				cameraMethod: 5,
				isClicked: false,
				targetPos: new THREE.Vector3(0, 0, 0),
				isTargetMoving: false,
			};
			const yAxis = new THREE.Vector3(0, 1, 0);
			const xAxis = new THREE.Vector3(1, 0, 0);
			const basePlane = new THREE.Plane(yAxis, 0);
			
			const cameraControls = new CameraControls( camera, renderer.domElement );
			cameraControls.verticalDragToForward = true;
			cameraControls.dollyToCursor = true;
			// cameraControls.boundaryEnclosesCamera = true
			
			// const bb = new THREE.Box3(
			//     new THREE.Vector3( -195.0, 35.0, -200.0 ),
			//     new THREE.Vector3( 180.0, 180.0, 350.0 )
			// );
			// cameraControls.setBoundary( bb );
			
			
			cameraControls.maxPolarAngle = (Math.PI * 0.5) - 0.25;
			cameraControls.minPolarAngle = (Math.PI * 0.5) - 0.3;
			cameraControls.minDistance = 400;
			cameraControls.maxDistance = 1000;
			cameraControls.maxZoom = 100;
			cameraControls.minZoom = 100;
			
			document.addEventListener('wheel', e => {
				if (e.deltaY < 0) {
					
						console.log(Math.min(cameraState.cameraMethod + 3, cameraState.cameraAngle.length - 1))
						cameraState.cameraMethod = Math.min(cameraState.cameraMethod + 3, cameraState.cameraAngle.length - 1);
					
				  
				} else {
					cameraState.cameraMethod = Math.max(cameraState.cameraMethod -3, 0);
					console.log('else ' + Math.max(cameraState.cameraMethod - 3, 0))
				}
			})
			document.addEventListener('mousedown', e => {
				cameraState.isClicked = true;
				cameraState.mousePos.setX(e.pageX);   cameraState.mousePos.setY(e.pageY);
				cameraState.targetPos = cameraControls.getTarget();
				cameraState.virtualMousePos.setX(e.pageX);   cameraState.virtualMousePos.setY(e.pageY);
			
				
				//calculate objects intersecting the picking ray
				//const intersects = raycaster.intersectObjects( allobjs);
			
				// for ( let i = 0; i < intersects.length; i ++ ) {
					
			
				// 		cameraState.cameraMethod = 8;
				// 		cameraState.isTargetMoving = true;
				// 		cameraState.targetPos = intersects[0].point.clone().setY(0);
					
				// }
			
				// if(intersects[0].object){
				// 	 newmodal.classList.add('active-modal')
				// }
			
				
			})
			const mouseMoveHandler = e => {
				if (!cameraState.isClicked) {
					e.preventDefault();
					return;
				}
				cameraState.mousePos.setX(e.pageX);   cameraState.mousePos.setY(e.pageY);
			}
			document.querySelector('canvas').addEventListener('mousemove', mouseMoveHandler);
			
			const cameraMover = (delta) => {
				let camPos, targetPos;
				let arm;
				camPos = cameraControls.getPosition();
				targetPos = cameraControls.getTarget();
				arm = targetPos.clone().sub(camPos);
				const norm = arm.clone().setY(0).normalize().multiplyScalar(delta.y * Math.log(camPos.y) / 26);
				arm.applyAxisAngle(yAxis, delta.x / 1000);
				targetPos = camPos.clone().add(arm);
				camPos.add(norm);
				targetPos.add(norm);
				targetPos.setY(0);
				
				// camPos.x -= deltaX;
				// targetPos.x -= deltaX;
				// camPos.z -= deltaY;
				// targetPos.z -= deltaY;
				cameraControls.setPosition(...camPos);
				cameraControls.setTarget(...targetPos);
				cameraState.virtualMousePos.add(delta);
			};
			const updateCamera = () => {
				const delta = cameraState.mousePos.clone().sub(cameraState.virtualMousePos).multiplyScalar(0.05);
				cameraMover(delta);
			
				const cameraPos = cameraControls.getPosition();
				const targetPos = cameraControls.getTarget();
				const cameraAngle = cameraPos.clone().sub(targetPos);
				const projectedAngle = new THREE.Vector3();
				basePlane.projectPoint(cameraAngle, projectedAngle);
				const direction = xAxis.clone().cross(projectedAngle).normalize().y;
				const angle = (Math.PI * 2 + xAxis.angleTo(projectedAngle) * direction) % (Math.PI * 2);
				const normalizedAngle = cameraAngle.clone().applyAxisAngle(yAxis, -angle);
				const newNormalizedAngle = normalizedAngle.add(cameraState.cameraAngle[cameraState.cameraMethod].clone().sub(normalizedAngle).multiplyScalar(0.03));
				const newCameraAngle = newNormalizedAngle.applyAxisAngle(yAxis, angle);
				const newCameraPos = targetPos.clone().add(newCameraAngle);
			
				if (cameraState.isTargetMoving) {
					const delta = cameraState.targetPos.clone().sub(targetPos);
					const newTargetPos = delta.clone().multiplyScalar(0.05).add(targetPos);
					cameraControls.setTarget(...newTargetPos);
					if (delta.length() < 1e-3) {
						cameraState.isTargetMoving = false;
					}
				}
				cameraControls.setPosition(...newCameraPos);
			}
			document.addEventListener('mouseup', () => {
				cameraState.isClicked = false;
			})
			
			
			
			
			cameraControls.mouseButtons.left = CameraControls.ACTION.NONE
			cameraControls.mouseButtons.right = CameraControls.ACTION.NONE
			cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE
			cameraControls.mouseButtons.wheel = CameraControls.ACTION.NONE
			cameraControls.addEventListener( 'controlstart', function() {
				switch ( cameraControls.currentAction ) {
						case CameraControls.ACTION.ROTATE:
						case CameraControls.ACTION.TOUCH_ROTATE: {
			
							renderer.domElement.classList.add( '-dragging' );
							break;
			
						}
			
						case CameraControls.ACTION.TRUCK:
						case CameraControls.ACTION.TOUCH_TRUCK: {
			
							renderer.domElement.classList.add( '-moving' );
							break;
			
						}
			
						case CameraControls.ACTION.DOLLY:
						case CameraControls.ACTION.ZOOM: {
			
							renderer.domElement.classList.add( '-zoomIn' );
							break;
			
						}
			
						case CameraControls.ACTION.TOUCH_DOLLY_TRUCK:
						case CameraControls.ACTION.TOUCH_ZOOM_TRUCK: {
			
							renderer.domElement.classList.add( '-moving' );
							break;
			
						}
			
						default: {
							break;
						}
					}
			} );
			cameraControls.addEventListener( 'controlend', function() {
			
				renderer.domElement.classList.remove(
					'-dragging',
					'-moving',
					'-zoomIn'
				);
			
			} );
			

// instructions.addEventListener( 'click', function () {

//     controls.lock();

// } );

// controls.addEventListener( 'lock', function () {

//     instructions.style.display = 'none';
//     blocker.style.display = 'none';

// } );

// controls.addEventListener( 'unlock', function () {

//     blocker.style.display = 'block';
//     instructions.style.display = '';

// } );

// scene.add( controls.getObject() );


// const onKeyDown = function ( event ) {

//     switch ( event.code ) {

//         case 'ArrowUp':
//         case 'KeyW':
//             moveForward = true;
//             break;

//         case 'ArrowLeft':
//         case 'KeyA':
//             moveLeft = true;
//             break;

//         case 'ArrowDown':
//         case 'KeyS':
//             moveBackward = true;
//             break;

//         case 'ArrowRight':
//         case 'KeyD':
//             moveRight = true;
//             break;

//         case 'Space':
//             if ( canJump === true ) velocity.y += 350;
//             canJump = false;
//             break;

//     }

// };

// const onKeyUp = function ( event ) {

//     switch ( event.code ) {

//         case 'ArrowUp':
//         case 'KeyW':
//             moveForward = false;
//             break;

//         case 'ArrowLeft':
//         case 'KeyA':
//             moveLeft = false;
//             break;

//         case 'ArrowDown':
//         case 'KeyS':
//             moveBackward = false;
//             break;

//         case 'ArrowRight':
//         case 'KeyD':
//             moveRight = false;
//             break;

//     }

// };

// document.addEventListener( 'keydown', onKeyDown );
// document.addEventListener( 'keyup', onKeyUp );
// raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );


// 			const clock = new THREE.Clock();

//             const update = () =>{
//                 const time = performance.now();

// 				if ( controls.isLocked === true ) {

// 					raycaster.ray.origin.copy( controls.getObject().position );
// 					raycaster.ray.origin.y -= 10;

// 					const intersections = raycaster.intersectObjects( objects, false );

// 					const onObject = intersections.length > 0;

// 					const delta = ( time - prevTime ) / 1000;

// 					velocity.x -= velocity.x * 10.0 * delta;
// 					velocity.z -= velocity.z * 10.0 * delta;

// 					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

// 					direction.z = Number( moveForward ) - Number( moveBackward );
// 					direction.x = Number( moveRight ) - Number( moveLeft );
// 					direction.normalize(); // this ensures consistent movements in all directions

// 					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
// 					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

// 					if ( onObject === true ) {

// 						velocity.y = Math.max( 0, velocity.y );
// 						canJump = true;

// 					}

// 					controls.moveRight( - velocity.x * delta );
// 					controls.moveForward( - velocity.z * delta );

// 					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

// 					if ( controls.getObject().position.y < 10 ) {

// 						velocity.y = 0;
// 						controls.getObject().position.y = 10;

// 						canJump = true;

// 					}

// 				}

// 				prevTime = time;
//             }

function animate() {
				requestAnimationFrame( animate );
         
     //  controls.update();
  //   controls.update( clock.getDelta() );
	//	update()
	updateCamera();
	cameraControls.update(0.01)
				renderer.render( scene, camera );
			};

			animate();