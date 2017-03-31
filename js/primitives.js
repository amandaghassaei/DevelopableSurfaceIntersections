/**
 * Created by amandaghassaei on 3/31/17.
 */


function Plane(){
    var planeGeo = new THREE.PlaneGeometry(1, 1);
    var plane = new THREE.Mesh(planeGeo, material2);
    plane.rotation.x = planeAngle;
    threeView.scene.add(plane);
    this.object3D = plane;
}

Plane.prototype.update = function(){
    var plane = this.object3D;
    plane.scale.set(planeSize, planeSize, 1);
    plane.rotation.x = planeAngle;

};

Plane.prototype.getNormal = function(){
    var planeNormal = new THREE.Vector3(0,0,1);
    planeNormal.applyEuler(this.object3D.rotation);
    return planeNormal;
};

Plane.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};


function Cylinder(){
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

    var cylinder = new THREE.Mesh(cylGeo, material1);
    this.object3D = cylinder;

    threeView.scene.add(cylinder);
}

Cylinder.prototype.update = function(){
    var cylGeo = this.object3D.geometry;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices[2*i].set(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2);
        cylGeo.vertices[2*i+1].set(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2);
    }
    cylGeo.computeFaceNormals();
    cylGeo.verticesNeedUpdate = true;
};

Cylinder.prototype.destroy = function(){
    threeView.scene.remove(this.object3D);
    this.object3D = null;
};