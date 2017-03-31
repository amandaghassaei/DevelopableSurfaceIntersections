/**
 * Created by ghassaei on 2/22/17.
 */

var planeAngle = 0.8;
var cylA = 16;
var cylB = 10;
var cylHeight = 200;
var threeView;

var cylGeo, plane, pts;

$(function() {

    pts = [];

    threeView = initThreeView();
    initControls();

    window.addEventListener('resize', function(){
        threeView.onWindowResize();
    }, false);

    drawCylinder();

});

function updateCylinder(){
    var thetaNum = 100;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices[2*i].set(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2);
        cylGeo.vertices[2*i+1].set(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2);
    }
    cylGeo.computeFaceNormals();
    cylGeo.verticesNeedUpdate = true;

    plane.rotation.x = planeAngle;
    var planeNormal = new THREE.Vector3(0,0,1);
    planeNormal.applyEuler(plane.rotation);

    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = pts[i];
        pt.position.set(cylA*Math.cos(theta), cylB*Math.sin(theta), (planeNormal.x*cylA*Math.cos(theta) - planeNormal.y*cylB*Math.sin(theta))/planeNormal.z);
    }

    threeView.render();
}

function drawCylinder(){

    //draw cylinder
    cylGeo = new THREE.Geometry();
    cylGeo.dynamic = true;
    var thetaNum = 100;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        cylGeo.vertices.push(new THREE.Vector3(cylA*Math.cos(theta), cylB*Math.sin(theta), -cylHeight/2));
        cylGeo.vertices.push(new THREE.Vector3(cylA*Math.cos(theta), cylB*Math.sin(theta), cylHeight/2));
        if (i<thetaNum-1) {
            cylGeo.faces.push(new THREE.Face3(2*i, 2*i+2, 2*i+1));
            cylGeo.faces.push(new THREE.Face3(2*i+2, 2*i+1, 2*i+3));
        } else {
            cylGeo.faces.push(new THREE.Face3(2*i, 0, 2*i+1));
            cylGeo.faces.push(new THREE.Face3(2*i+1, 0, 1));
        }

    }
    cylGeo.computeFaceNormals();

    threeView.scene.add(new THREE.Mesh(cylGeo, new THREE.MeshLambertMaterial({shading: THREE.FlatShading, color:0xff00ff, side:THREE.DoubleSide})));

    var planeGeo = new THREE.PlaneGeometry(500, 500);
    plane = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide }));
    plane.rotation.x = planeAngle;
    threeView.scene.add(plane);

    var planeNormal = new THREE.Vector3(0,0,1);
    planeNormal.applyEuler(plane.rotation);

    var sphereGeo = new THREE.SphereGeometry(0.4);
    var sphereMat = new THREE.MeshBasicMaterial({color:0x00ff00});
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = new THREE.Mesh(sphereGeo, sphereMat);
        pt.position.set(cylA*Math.cos(theta), cylB*Math.sin(theta), (planeNormal.x*cylA*Math.cos(theta) - planeNormal.y*cylB*Math.sin(theta))/planeNormal.z);
        pts.push(pt);
        threeView.scene.add(pt);
    }

    threeView.render();
}