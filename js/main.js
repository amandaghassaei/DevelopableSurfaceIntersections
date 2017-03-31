/**
 * Created by ghassaei on 2/22/17.
 */

var thetaNum = 100;
var ptScale = 0.5;

var planeAngle1 = 0.8;
var planeSize1 = 500;

var planeAngle2 = planeAngle1;
var planeSize2 = planeSize1;


var cylA2 = 16;
var cylB2 = 10;
var cylHeight2 = 200;


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
    $("#plane1").hide();
    $("#plane2").hide();
    $("#cylinder2").hide();

    clear();
    geos = [];
    if (geo1 == "plane") {
        $("#plane1").show();
        geos.push(new Plane());
    }
    if (geo2 == "cylinder") {
        $("#cylinder2").show();
        geos.push(new Cylinder());
    }
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



    if (geo1 == "plane"){
        geos[0].update(planeAngle1, planeSize1);
        if (geo2 == "cylinder"){
            geos[1].update(cylA2, cylB2, cylHeight2);
            intersectPlaneCyl(geos[0].getNormal());
        }
    }



    threeView.render();
}

function intersectPlaneCyl(planeNormal){
    for (var i=0;i<thetaNum;i++){
        var theta = i/thetaNum*Math.PI*2;
        var pt = pts[i];
        pt.scale.set(ptScale, ptScale, ptScale);
        pt.position.set(cylA2*Math.cos(theta), cylB2*Math.sin(theta), (planeNormal.x*cylA2*Math.cos(theta) - planeNormal.y*cylB2*Math.sin(theta))/planeNormal.z);
    }

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