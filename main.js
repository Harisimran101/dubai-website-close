import * as THREE from 'https://cdn.skypack.dev/three@0.136';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color('white')


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


	const controls = new OrbitControls( camera, renderer.domElement );
controls.maxDistance = 110;
controls.minDistance = 2;
controls.enableDamping = true;
controls.dampingFactor = 0.035
controls.maxPolarAngle = Math.PI /2.2



const loader = new GLTFLoader();
loader.load('model.glb', (gltf) =>{
   const model = gltf.scene;
   scene.add(model);
  model.scale.set(0.2,0.2,0.2)

  
})

new RGBELoader().load('https://assets.codepen.io/7014830/studio.hdr',function(texture){
texture.mapping = THREE.EquirectangularReflectionMapping;

   scene.environment = texture;
})


			camera.position.set(0,30,60)

function animate() {
				requestAnimationFrame( animate );
         
       controls.update();
        			
				renderer.render( scene, camera );
			};

			animate();