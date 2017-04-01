/**
 * Created by amandaghassaei on 3/31/17.
 */


function Plane(material){
    var planeGeo = new THREE.PlaneGeometry(1, 1);
    planeGeo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));//orient with xz to start
    var plane = new THREE.Mesh(planeGeo, material);
    threeView.scene.add(plane);
    this.object3D = plane;
}

Plane.prototype.update = function(planeSize, planeAngle){
    var plane = this.object3D;
    plane.scale.set(planeSize, planeSize, planeSize);
    if (planeAngle !== undefined) plane.rotation.x = planeAngle;
};

Plane.prototype.getNormal = function(){
    var planeNormal = new THREE.Vector3(0,1,0);
    planeNormal.applyEuler(this.object3D.rotation);
    return planeNormal;
};

Plane.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};


function Cylinder(material){
    var cylGeo = new THREE.Geometry();
    cylGeo.dynamic = true;
    for (var i = 0; i < thetaNum; i++) {
        cylGeo.vertices.push(new THREE.Vector3());
        cylGeo.vertices.push(new THREE.Vector3());
        if (i < thetaNum - 1) {
            cylGeo.faces.push(new THREE.Face3(2 * i, 2 * i + 2, 2 * i + 1));
            cylGeo.faces.push(new THREE.Face3(2 * i + 2, 2 * i + 1, 2 * i + 3));
        } else {
            cylGeo.faces.push(new THREE.Face3(2 * i, 0, 2 * i + 1));
            cylGeo.faces.push(new THREE.Face3(2 * i + 1, 0, 1));
        }

    }
    cylGeo.computeFaceNormals();

    var cylinder = new THREE.Mesh(cylGeo, material);
    this.object3D = cylinder;

    threeView.scene.add(cylinder);
}

Cylinder.prototype.update = function(cylA, cylB, phase, cylHeight, cylAngle, cylX){
    var cylGeo = this.object3D.geometry;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices[2*i].set(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2);
        cylGeo.vertices[2*i+1].set(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2);
    }
    cylGeo.computeFaceNormals();
    cylGeo.verticesNeedUpdate = true;
    this.object3D.rotation.z = phase;
    if (cylAngle !== undefined) this.object3D.rotation.x = cylAngle;
    if (cylX != undefined) this.object3D.position.x = cylX;
};

Cylinder.prototype.intersectPlane = function(normal, cylA, cylB, cylPhase, _pts){
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = _pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        //if rotating around x axis -> normal.x = 0;
        //simplifies to
        // pt.position.set(x, y, -normal.y/normal.z*y);
        var _x = cylA*Math.cos(theta);
        var _y = cylB*Math.sin(theta);
        //rotation around z
        var x = _x*Math.cos(cylPhase) - _y*Math.sin(cylPhase);
        var y = _x*Math.sin(cylPhase) + _y*Math.cos(cylPhase);
        pt.position.set(x, y, -(normal.x*x + normal.y*y)/normal.z);
    }
};

Cylinder.prototype.intersectCylinder = function(_cylA1, _cylB1, _cylPhase1, _cylA2, _cylB2, _cylPhase2, _cylX2, _pts){
    _cylPhase2 *= -1;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = _pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        var _x = _cylA1*Math.cos(theta);
        var _y = _cylB1*Math.sin(theta);
        //rotation cylinder 1 around z
        var x = _x*Math.cos(_cylPhase1) - _y*Math.sin(_cylPhase1);
        var y = _x*Math.sin(_cylPhase1) + _y*Math.cos(_cylPhase1);
        //rotation cylinder 2 around z
        //-angle?  needed a neg sign on angle or whole expression, not sure where that's coming from


        var z = 1/(Math.pow(Math.sin(-angle),2) * (_cylA2*_cylA2*Math.pow(Math.cos(_cylPhase2), 2) + _cylB2*_cylB2*Math.pow(Math.sin(_cylPhase2), 2)))
        *(-Math.sqrt(_cylA2*_cylA2*_cylB2*_cylB2*Math.pow(Math.sin(-angle), 2)*
                (_cylA2*_cylA2*Math.pow(Math.cos(_cylPhase2), 2) + _cylB2*_cylB2*Math.pow(Math.sin(_cylPhase2), 2)
                - x*x*Math.pow(Math.sin(_cylPhase2), 4) - x*x*Math.pow(Math.cos(_cylPhase2), 4)
                -2*x*x*Math.pow(Math.sin(_cylPhase2), 2)*Math.pow(Math.cos(_cylPhase2), 2)))
                + _cylA2*_cylA2*x*Math.sin(-angle)*Math.sin(_cylPhase2)*Math.cos(_cylPhase2)
                + _cylA2*_cylA2*y*Math.sin(-angle)*Math.cos(-angle)*Math.pow(Math.cos(_cylPhase2), 2)
                -_cylB2*_cylB2*x*Math.sin(-angle)*Math.sin(_cylPhase2)*Math.cos(_cylPhase2)
                + _cylB2*_cylB2*y*Math.sin(-angle)*Math.cos(-angle)*Math.pow(Math.sin(_cylPhase2), 2));
        pt.position.set(x, y, z);

        //with _cylPhase = 0, simplifies to:
        // pt.position.set(x, y, (Math.cos(-angle)*y-_cylB2*Math.sqrt(1-(x-_cylX2)*(x-_cylX2)/(_cylA2*_cylA2)))/Math.sin(-angle));
    }
};

Cylinder.prototype.unwrapPts = function(_pts, _unwrappedPts){
    var xPos = 0;
    for (var i=0;i<thetaNum;i++){
        var pt = _unwrappedPts[i];
        pt.scale.set(ptScale, ptScale, ptScale);

        //The arc length of an ellipse, in general, has no closed-form solution in terms of elementary functions
        //for circle, arc length = Math.PI*2/thetaNum * r
        if (i>0) {
            var vect = _pts[i].position.clone().sub(_pts[i-1].position);
            vect.z = 0;
            xPos -= vect.length();
        }

        pt.position.set(xPos, 0, _pts[i].position.z);
    }
};

Cylinder.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};

function Cone(material){
    var coneGeo = new THREE.Geometry();
    coneGeo.dynamic = true;
    for (var i = 0; i < thetaNum; i++) {
        coneGeo.vertices.push(new THREE.Vector3());
        if (i < thetaNum - 1) {
            coneGeo.faces.push(new THREE.Face3(i, thetaNum, i + 1));
        } else {
            coneGeo.faces.push(new THREE.Face3(i, 0, thetaNum));
        }

    }
    coneGeo.vertices.push(new THREE.Vector3());//top vertex
    coneGeo.computeFaceNormals();

    var cone = new THREE.Mesh(coneGeo, material);
    this.object3D = cone;

    threeView.scene.add(cone);
}

Cone.prototype.update = function(coneA, coneB, phase, coneHeight, coneZ, coneAngle, coneX){
    var coneGeo = this.object3D.geometry;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        coneGeo.vertices[i].set(coneA*Math.cos(theta), coneB*Math.sin(theta), -coneHeight/2);
    }
    coneGeo.vertices[thetaNum].set(0,0,coneHeight/2);
    coneGeo.computeFaceNormals();
    coneGeo.verticesNeedUpdate = true;
    this.object3D.rotation.z = phase;
    if (coneAngle !== undefined) this.object3D.rotation.x = coneAngle;
    if (coneX != undefined) this.object3D.position.x = coneX;
    if (coneZ != undefined) this.object3D.position.z = coneZ;
};

Cone.prototype.intersectPlane = function(normal, coneA, coneB, conePhase, _pts){
    // for (var i=0;i<thetaNum;i++){
    //     var theta = i/thetaNum*Math.PI*2;
    //     var pt = _pts[i];
    //     pt.scale.set(ptScale, ptScale, ptScale);
    //
    //     var _x = Math.sqrt()
    //     pt.position.set(_x, _y, -(normal.x*_x + normal.y*_y)/normal.z);
    // }
};

Cone.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};