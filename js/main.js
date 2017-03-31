/**
 * Created by ghassaei on 2/22/17.
 */

var thetaNum = 100;
var ptScale = 0.5;

var planeAngle = 0.8;
var planeSize = 500;
var cylA = 16;
var cylB = 10;
var cylHeight = 200;
var threeView;

var cylinder;

var plane;
var planeNormal;

var pts;

$(function() {

    threeView = initThreeView();
    initControls();

    window.addEventListener('resize', function(){
        threeView.onWindowResize();
    }, false);

    initCylinder();
    initPlane();
    initIntersection();
    updateIntersection()

});

function clear(){

    if (plane) {
        threeView.scene.remove(plane);
        plane = null;
    }
    if (cylinder) {
        threeView.scene.remove(cylinder);
        cylinder = null;
    }

    if (pts){
        _.each(pts, function(pt){
            threeView.scene.remove(pt);
        });
    }
    pts = [];
}

function updateIntersection(){

    updateCylinder();
    updatePlane();

    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        pt.position.set(cylA*Math.cos(theta), cylB*Math.sin(theta), (planeNormal.x*cylA*Math.cos(theta) - planeNormal.y*cylB*Math.sin(theta))/planeNormal.z);
    }

    threeView.render();
}

function updatePlane(){
    plane.scale.set(planeSize, planeSize, 1);
    plane.rotation.x = planeAngle;
    planeNormal = new THREE.Vector3(0,0,1);
    planeNormal.applyEuler(plane.rotation);
}

function updateCylinder(){
    var cylGeo = cylinder.geometry;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices[2*i].set(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2);
        cylGeo.vertices[2*i+1].set(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2);
    }
    cylGeo.computeFaceNormals();
    cylGeo.verticesNeedUpdate = true;
}

function initCylinder() {
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

    cylinder = new THREE.Mesh(cylGeo, new THREE.MeshLambertMaterial({
        shading: THREE.FlatShading,
        color: 0xff00ff,
        side: THREE.DoubleSide
    }));

    threeView.scene.add(cylinder);
}

function initPlane() {

    var planeGeo = new THREE.PlaneGeometry(1, 1);
    plane = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide}));
    plane.rotation.x = planeAngle;
    threeView.scene.add(plane);
}

function initIntersection(){

    pts = [];

    var sphereGeo = new THREE.SphereGeometry(1);
    var sphereMat = new THREE.MeshBasicMaterial({color:0x00ff00});
    for (var i=0;i<thetaNum;i++){
        var pt = new THREE.Mesh(sphereGeo, sphereMat);
        pts.push(pt);
        threeView.scene.add(pt);
    }
}