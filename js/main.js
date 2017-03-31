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

var geo1 = "plane";
var geo2 = "cylinder";

var material1 = new THREE.MeshLambertMaterial({
    shading: THREE.FlatShading,
    color: 0xff00ff,
    side: THREE.DoubleSide
});
var material2 = new THREE.MeshLambertMaterial({
    shading: THREE.FlatShading,
    color: 0x00ffff,
    side: THREE.DoubleSide
});


var geos;

var pts;

var unwrappedPts;

$(function() {

    threeView = initThreeView();
    initControls();

    window.addEventListener('resize', function(){
        threeView.onWindowResize();
    }, false);


    initGeos();
});

function initGeos(){
    clear();
    geos = [];
    if (geo1 == "plane") geos.push(new Plane());
    if (geo2 == "cylinder") geos.push(new Cylinder());
    initIntersection();
    updateIntersection()
}

function clear(){

    if (geos && geos.length > 0){
        geos[0].destroy();
        geos[1].destroy();
    }


    if (pts){
        _.each(pts, function(pt){
            threeView.scene2.remove(pt);
        });
    }
    pts = [];
    if (unwrappedPts){
        _.each(unwrappedPts, function(pt){
            threeView.scene2.remove(pt);
        });
    }
    unwrappedPts = [];
}

function updateIntersection(){

    geos[0].update();
    geos[1].update();

    var planeNormal = geos[0].getNormal();

    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        pt.position.set(cylA*Math.cos(theta), cylB*Math.sin(theta), (planeNormal.x*cylA*Math.cos(theta) - planeNormal.y*cylB*Math.sin(theta))/planeNormal.z);
    }

    var xPos = 0;
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = unwrappedPts[i];
        pt.scale.set(ptScale, ptScale, ptScale);

        //The arc length of an ellipse, in general, has no closed-form solution in terms of elementary functions
        //for circle, arc length = Math.PI*2/thetaNum * r
        if (i>0) {
            var vect = pts[i].position.clone().sub(pts[i-1].position);
            vect.z = 0;
            xPos += vect.length();
        }

        pt.position.set(xPos, 0, (planeNormal.x*cylA*Math.cos(theta) - planeNormal.y*cylB*Math.sin(theta))/planeNormal.z);
    }

    threeView.render();
}

function initIntersection(){

    pts = [];

    var sphereGeo = new THREE.SphereGeometry(1);
    var sphereMat = new THREE.MeshBasicMaterial({color:0x00ff00});
    for (var i=0;i<thetaNum;i++){
        var pt = new THREE.Mesh(sphereGeo, sphereMat);
        pts.push(pt);
        threeView.scene2.add(pt);
    }

    unwrappedPts = [];
    var sphereMat = new THREE.MeshBasicMaterial({color:0xff0000});
    for (var i=0;i<thetaNum;i++){
        var pt = new THREE.Mesh(sphereGeo, sphereMat);
        unwrappedPts.push(pt);
        threeView.scene2.add(pt);
    }
}