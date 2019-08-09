const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera( 75 , aspect , 0.1 , 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// camera.position.x += 15;
// camera.position.y += 2;
// camera.position.z = 10;

// translate(camera,createVector(15,2,10))
// rotateY(camera,1)
// camera.rotation.y += 1

const foot = createNormalBox(createVector(2,1,1));
const tibia = createNormalBox(createVector(1,4,1));
const thigh = createNormalBox(createVector(1,3,1));
const pelvis = createNormalBox(createVector(1.2,2.5,2));
const torso = createNormalBox(createVector(1.2,3,3));
const shoulders = createNormalBox(createVector(1.2,1,5.4));
const bicep = createNormalBox(createVector(1.2,2.5,1));
const forearm = bicep.clone();
const elbow = createNormalSphere({ r: 0.5 });
const head = createNormalSphere({ r: 1.3 });

const footContainer = createContainer(foot);
const tibiaContainer = createContainer(tibia,footContainer);
const thighContainer = createContainer(thigh,tibiaContainer);
const forearmContainer = createContainer(forearm,elbow);
const armContainer = createContainer(bicep,forearmContainer);
const shouldersContainer = createContainer(head,shoulders,armContainer);
const torsoContainer = createContainer(torso,shouldersContainer);
const pelvisContainer = createContainer(pelvis,thighContainer,torsoContainer);

translateY(head,2)
translateY(forearm,-1.8);
translate(forearmContainer,createVector(0,-3,0))
rotateZ(forearmContainer,toRadians(-75))
translate(armContainer,createVector(0,0,2.2))
translateY(bicep,-1.2);
translateY(torsoContainer,3);
translateY(shouldersContainer,2)
translateY(pelvis,0.75)
rotateZ(pelvisContainer,toRadians(17));
translate(thighContainer,createVector(0,0,0.5))
translateY(thigh,-1.5);
translateY(tibiaContainer,-3);
translate(footContainer,createVector(-0.5,-4));
translateY(tibia,-2.1);

const otherLegContainer = thighContainer.clone();
translateZ(otherLegContainer, -1);
pelvisContainer.add(otherLegContainer);

const otherArmContainer = armContainer.clone();
translateZ(otherArmContainer, -4.4);
shouldersContainer.add(otherArmContainer)

const control = createControl(camera,shouldersContainer);
scene.add(pelvisContainer);

const state = {
    t: 0,
    setting: 0,
    deltaT: 0.1,
    tick(){
        this.t += this.deltaT;
        if( this.t === Math.PI * 2 ){
            this.t = 0;
        }
    },
    cycleTime(){
        this.setting++;
        this.setting = this.setting % 3;
        this.deltaT = Math.pow(10 , -(this.setting+1));
    }
}

window.addEventListener("keyup",(e) => {
    if(e.code === "Space") state.cycleTime()
})

function render() {
    requestAnimationFrame( render );
    thighContainer.rotation.z = Math.cos(state.t);
    tibiaContainer.rotation.z = Math.sin(state.t)+1;

    otherLegContainer.rotation.z = Math.cos(state.t + Math.PI);
    otherLegContainer.children[1].rotation.z = Math.sin(state.t + Math.PI) + 1;

    armContainer.rotation.z = Math.cos(state.t+ Math.PI)
    otherArmContainer.rotation.z = Math.cos(state.t) 

    pelvisContainer.rotation.y = 0.1*Math.cos(state.t);
    
    state.tick();
    renderer.render( scene, camera );
}
render();