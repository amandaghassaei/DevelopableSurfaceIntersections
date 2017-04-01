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
    if (planeAngle !== undefined) plane.rotation.x = -planeAngle;
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

Cylinder.prototype.update = function(cylA, cylB, cylHeight, cylAngle){
    var cylGeo = this.object3D.geometry;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices[2*i].set(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2);
        cylGeo.vertices[2*i+1].set(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2);
    }
    cylGeo.computeFaceNormals();
    cylGeo.verticesNeedUpdate = true;
    if (cylAngle !== undefined) this.object3D.rotation.x = cylAngle;
};

Cylinder.prototype.intersectPlane = function(normal, cylA, cylB, pts){
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        pt.position.set(cylA*Math.cos(theta), cylB*Math.sin(theta), (normal.x*cylA*Math.cos(theta) - normal.y*cylB*Math.sin(theta))/normal.z);
    }
};

Cylinder.prototype.unwrapPts = function(pts, unwrappedPts){
    var xPos = 0;
    for (var i=0;i<thetaNum;i++){
        var pt = unwrappedPts[i];
        pt.scale.set(ptScale, ptScale, ptScale);

        //The arc length of an ellipse, in general, has no closed-form solution in terms of elementary functions
        //for circle, arc length = Math.PI*2/thetaNum * r
        if (i>0) {
            var vect = pts[i].position.clone().sub(pts[i-1].position);
            vect.z = 0;
            xPos += vect.length();
        }

        pt.position.set(xPos, 0, pts[i].position.z);
    }
};

Cylinder.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};