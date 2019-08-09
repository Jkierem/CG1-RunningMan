const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 75 , aspect , 0.1 , 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 4, 24, 24 );
const material = new THREE.MeshBasicMaterial({color: 0xffff00});
const sun = new THREE.Mesh( geometry, material );

const geometry2 = new THREE.SphereGeometry( 1, 24, 24 );
const material2 = new THREE.MeshNormalMaterial();
const earth = new THREE.Mesh( geometry2, material2 );

const geometry3 = new THREE.SphereGeometry( 0.5, 24, 24 );
const material3 = new THREE.MeshNormalMaterial();
const moon = new THREE.Mesh( geometry3, material3 );

earth.position.x += 8;
moon.position.x = earth.position.x + 3;

scene.add(sun);
scene.add(earth);
scene.add(moon);

camera.position.z = 30;

const deltaX = 0.02;
const deltaY = 0.02;
const deltaZ = 0.02;

let t = 0;

function render() {
    requestAnimationFrame( render );
    earth.position.x = 8*Math.cos(t);
    earth.position.y = 8*Math.sin(t);
    const { x , y } = earth.position;
    moon.position.x = x + (2*Math.cos(2*t))
    moon.position.y = y + (2*Math.sin(2*t))
    t+= 0.1;
    renderer.render( scene, camera );
}
render();