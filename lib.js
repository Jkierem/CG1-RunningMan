const isFunction = what => what instanceof Function;

const createNormalMaterialMesh = (geometry) => {
    const material = new THREE.MeshNormalMaterial();
    return new THREE.Mesh(geometry,material);
}

const createNormalBox = ({ x , y , z }) => {
    const geometry = new THREE.BoxGeometry(x,y,z);
    return createNormalMaterialMesh(geometry);
}

const createNormalSphere = (sphereData) => {
    const { r , wSegments = 24 , hSegments = 24 } = sphereData;
    const geometry = new THREE.SphereGeometry( r , wSegments , hSegments);
    return createNormalMaterialMesh(geometry);
}

const createContainer = (...objs) => {
    const cont = new THREE.Object3D();
    if( objs.length > 0 ){
        cont.add(...objs);
    }
    return cont;
}

const _head = ([head]) => head;
const _tail = ([,...tail]) => tail;
const _isEmpty = a => a.length === 0;
const _zip = (...arrs) => arrs.some(_isEmpty) ? [] : [arrs.map(_head),..._zip(...arrs.map(_tail))]

const multiplyBy = x => y => x*y
const divideBy = x => y => y/x

const toDegrees = rads => (rads*180)/Math.PI;
const toRadians = degs => (degs*Math.PI)/180;
const toCartesianFromSpherical = v => createVector(
    v.x * Math.cos(v.y) * Math.cos(v.z),
    v.x * Math.cos(v.y) * Math.sin(v.z),
    v.x * Math.sin(v.y)
)

const interval = (min,max) => (value) => {
    value = value % max;
    if( value < 0 ){
        value += max;
    }
    return min + value
}

const moveToOrigin = (object) => {
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;
}

const translate = (object,vector=createVector()) => {
    object.position.x += vector.x;
    object.position.y += vector.y;
    object.position.z += vector.z;
}

const translateX = (obj,x) => translate(obj,createVector(x));
const translateY = (obj,y) => translate(obj,createVector(0,y));
const translateZ = (obj,z) => translate(obj,createVector(0,0,z));
 
const rotate = (object,vector) => {
    object.rotation.x = vector.x;
    object.rotation.y = vector.y;
    object.rotation.z = vector.z;
}

const rotateX = (obj,x) => rotate(obj,createVector(x))
const rotateY = (obj,y) => rotate(obj,createVector(0,y))
const rotateZ = (obj,z) => rotate(obj,createVector(0,0,z))

const scale = (object,vector) => {
    object.scale.x = vector.x;
    object.scale.y = vector.y;
    object.scale.z = vector.z;
}

const scaleX = (obj,x) => scale(obj,createVector(x))
const scaleY = (obj,y) => scale(obj,createVector(0,y))
const scaleZ = (obj,z) => scale(obj,createVector(0,0,z))

const createVector = (...values) =>  {
    const data = [...values];
    return {
        dims: values.length,
        get x(){ return data[0] || 0 },
        set x(val){ data[0] = val },
        get y(){ return data[1] || 0 },
        set y(val){ data[1] = val },
        get z(){ return data[2] || 0 },
        set z(val){ data[2] = val },
        get(index){ return data[index] || 0 },
        map: (fn) => createVector(...data.map(fn)),
        reduce: (fn) => data.reduce(fn),
        add(v1){
            return this.map((vd,index) => vd + v1.get(index))
        },
        sub(v1){
            return this.map((vd,index) => vd - v1.get(index))
        },
        scale(v){
            return this.map(multiplyBy(v));
        },
        mod: () => Math.sqrt(data.reduce( (x,y) => x + (y*y) ,0)),
        normalize(v=1){
            return this
                .map(divideBy(this.mod()))
                .map(multiplyBy(v))
        },
        distance(vector){
            return this.sub(vector).mod();
        },
        toArray(){
            return data;
        }
    }
}

const defineObservableValue = (obj,callback) => (key,init) => {
    let val = init;
    return Object.defineProperty(obj,key,{
        get(){ return val },
        set(value){ 
            val = value; 
            callback(this,value)
        }
    })
}

const defineObservableValues = (obj,keys,inits,callback) => {
    return _zip(keys,inits).reduce(
        (acc,[key,init]) => defineObservableValue(acc,key,init,callback),
        obj
    )
}

const Vector = {
    create: createVector,
    fromObj: (obj) => createVector(obj.x, obj.y , obj.z),
    LEFT: createVector(-1),
    RIGHT: createVector(1),
    DOWN: createVector(0,-1),
    UP: createVector(0,1),
    FAR: createVector(0,0,1),
    NEAR: createVector(0,0,-1),
    sub: (v0,v1) => v0.sub(v1),
    scale: (vector,v) => vector.scale(v),
    mod: (vector) => vector.mod(),
    normalize: (vector,v=1) => vector.normalize(v),
}

const Keys = {
    KeyA: 65,
    KeyD: 68,
    KeyS: 83,
    KeyW: 87,
    KeyLeft: 37,
    KeyUp: 38,
    KeyRight: 39,
    KeyDown: 40,
    KeyR: 82,
    KeyE:69,
    KeyQ:81,
}