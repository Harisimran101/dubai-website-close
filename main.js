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

console.log(FirstPersonControls)
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

const controls = new PointerLockControls( camera, document.body );


instructions.addEventListener( 'click', function () {

    controls.lock();

} );

controls.addEventListener( 'lock', function () {

    instructions.style.display = 'none';
    blocker.style.display = 'none';

} );

controls.addEventListener( 'unlock', function () {

    blocker.style.display = 'block';
    instructions.style.display = '';

} );

scene.add( controls.getObject() );


const onKeyDown = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;

        case 'Space':
            if ( canJump === true ) velocity.y += 350;
            canJump = false;
            break;

    }

};

const onKeyUp = function ( event ) {

    switch ( event.code ) {

        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;

        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;

        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;

        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;

    }

};

document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );
raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

const loader = new GLTFLoader();
loader.load('model.glb', (gltf) =>{
   const model = gltf.scene;
   scene.add(model);
  model.scale.set(0.2,0.2,0.2)

  
})

new RGBELoader().load('https://assets.codepen.io/7014830/studio.hdr',function(texture){
texture.mapping = THREE.EquirectangularReflectionMapping;
 scene.background = texture
   scene.environment = texture;
})


			camera.position.set(0,30,60)
			const clock = new THREE.Clock();

            const update = () =>{
                const time = performance.now();

				if ( controls.isLocked === true ) {

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;

					const intersections = raycaster.intersectObjects( objects, false );

					const onObject = intersections.length > 0;

					const delta = ( time - prevTime ) / 1000;

					velocity.x -= velocity.x * 10.0 * delta;
					velocity.z -= velocity.z * 10.0 * delta;

					velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

					direction.z = Number( moveForward ) - Number( moveBackward );
					direction.x = Number( moveRight ) - Number( moveLeft );
					direction.normalize(); // this ensures consistent movements in all directions

					if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
					if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;

					if ( onObject === true ) {

						velocity.y = Math.max( 0, velocity.y );
						canJump = true;

					}

					controls.moveRight( - velocity.x * delta );
					controls.moveForward( - velocity.z * delta );

					controls.getObject().position.y += ( velocity.y * delta ); // new behavior

					if ( controls.getObject().position.y < 10 ) {

						velocity.y = 0;
						controls.getObject().position.y = 10;

						canJump = true;

					}

				}

				prevTime = time;
            }

function animate() {
				requestAnimationFrame( animate );
         
     //  controls.update();
  //   controls.update( clock.getDelta() );
		update()
				renderer.render( scene, camera );
			};

			animate();