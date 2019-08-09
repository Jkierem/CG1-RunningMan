const _CONSTANTS = {
    ORIGIN: createVector(0,0,0),
    DEFAULT_OPS: {
        rho: 20,
        theta: toRadians(50),
        phi: toRadians(160),
    }
}

const betweenCeroAndPI = interval(0,Math.PI);
const betweenCeroAnd2PI = interval(0,2*Math.PI);

const createControl = (
    camera,
    _focus=_CONSTANTS.ORIGIN, 
    options=_CONSTANTS.DEFAULT_OPS
) => {
    let focus = _focus.position ? 
        Vector.fromObj(_focus.position) : 
        _focus;

    const { rho , phi , theta } = options;
    
    const lookAtPoint = camera => (_x,_y,_z) => {
        const { x=_x , y=_y , z=_z } = _x;
        camera.lookAt(x,y,z);
    }

    const lookAt = camera => (...args) => {
        const look = lookAtPoint(camera)
        const [x,y,z] = args;
        if( x.position ){
            look(x.position);
        } else {
            look(x,y,z);
        }
    }

    const control = {
        update(){
            const spherical = createVector(this.rho,this.theta,this.phi)
            const offset = toCartesianFromSpherical(spherical)
            const loc = this.focus.add(offset)
            moveToOrigin(camera);
            translate(camera,loc);
            lookAt(camera)(focus);
        }
    }
    const defineControlProp = defineObservableValue(control, ctrl => ctrl.update());
    defineControlProp("rho",rho);
    defineControlProp("focus",focus);
    defineControlProp("phi",phi);
    defineControlProp("theta",theta);
    
    control.zoom = function(value){ this.rho += value; }
    control.inclination = function(value){ this.theta = betweenCeroAnd2PI(this.theta + toRadians(value) ) }
    control.azimuth = function(value){ this.phi = betweenCeroAndPI(this.phi + toRadians(value)); }
    control.setFocus = function(focus){ this.focus = focus; }
    control.reset = function(){
        this.rho = rho;
        this.theta = theta;
        this.phi = phi;
    }

    control.update();

    window.addEventListener("keydown", (e) => {
        const { keyCode } = e;
        switch(keyCode){
            case Keys.KeyA:
                control.inclination(5)
                break;
            case Keys.KeyD:
                control.inclination(-5);
                break;
            case Keys.KeyW:
                control.azimuth(5);
                break;
            case Keys.KeyS:
                control.azimuth(-5);
                break;
            case Keys.KeyQ:
                control.zoom(1);
                break;
            case Keys.KeyE:
                control.zoom(-1);
                break;
            case Keys.KeyR:
                control.reset();
                break;
        }
    })

    return control;
}