/**
 * Created by ghassaei on 2/22/17.
 */

var thetaNum = 100;
var ptScale = 0.5;
var angle = Math.PI/4;


//plane params
var planeSize1 = 500;
var planeSize2 = planeSize1;


//cylinder params
var cylA1 = 20;
var cylB1 = cylA1;
var cylPhase1 = 0;
var cylHeight1 = 200;
var cylA2 = cylA1;
var cylB2 = cylB1;
var cylPhase2 = cylPhase1;
var cylHeight2 = cylHeight1;
var cylX2 = 0;//x offset

//cone params
var coneA1 = 20;
var coneB1 = coneA1;
var conePhase1 = 0;
var coneHeight1 = 200;
var coneZ1 = 0;//z offset
var coneA2 = coneA1;
var coneB2 = coneB1;
var conePhase2 = conePhase1;
var coneHeight2 = coneHeight1;
var coneX2 = 0;//x offset
var coneZ2 = 0;//z offset

var threeView;

var geo1 = "cylinder";
var geo2 = "plane";

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
    $("#cylinder1").hide();
    $("#cylinder2").hide();
    $("#cone1").hide();
    $("#cone2").hide();

    clear();
    geos = [];
    if (geo1 == "plane") {
        $("#plane1").show();
        geos.push(new Plane(material1));
    }
    if (geo1 == "cylinder") {
        $("#cylinder1").show();
        geos.push(new Cylinder(material1));
    }
    if (geo1 == "cone") {
        $("#cone1").show();
        geos.push(new Cone(material1));
    }

    if (geo2 == "plane") {
        $("#plane2").show();
        geos.push(new Plane(material2));
    }
    if (geo2 == "cylinder") {
        $("#cylinder2").show();
        geos.push(new Cylinder(material2));
    }
    if (geo2 == "cone") {
        $("#cone2").show();
        geos.push(new Cone(material2));
    }

    initIntersection();
    updateIntersection();
}

function clear(){

    if (geos && geos.length > 0){
        if (geos[0]) geos[0].destroy();
        if (geos[1]) geos[1].destroy();
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
    // if (geo1 == "plane"){
    //     geos[0].update(planeSize1);
    //     var normal = geos[0].getNormal();
    //     if (geo2 == "plane"){
    //         geos[1].update(planeSize2, angle);
    //     } else if (geo2 == "cylinder"){
    //         geos[1].update(cylA2, cylB2, cylHeight2, angle);
    //         geos[1].intersectPlane(normal, pts);
    //         geos[1].unwrapPts(normal, pts, unwrappedPts);
    //     }
    // } else
    if (geo1 == "cylinder"){
        geos[0].update(cylA1, cylB1, cylPhase1, cylHeight1);
        if (geo2 == "plane"){
            geos[1].update(planeSize2, angle);
            geos[0].intersectPlane(geos[1].getNormal(), cylA1, cylB1, cylPhase1, pts);
            geos[0].unwrapPts(pts, unwrappedPts);
        } else if (geo2 == "cylinder"){
            geos[1].update(cylA2, cylB2, cylPhase2, cylHeight2, angle, cylX2);
            geos[0].intersectCylinder(cylA1, cylB1, cylPhase1, cylA2, cylB2, cylPhase2, cylX2, pts);
            geos[0].unwrapPts(pts, unwrappedPts);
        } else if (geo2 == "cone"){
            geos[1].update(coneA2, coneB2, conePhase2, coneHeight2, coneZ2, angle, coneX2);
            geos[0].intersectCone(cylA1, cylB1, cylPhase1, coneA2, coneB2, coneHeight2, conePhase2, coneZ2, coneX2, pts);
            geos[0].unwrapPts(pts, unwrappedPts);
        }
    } else if (geo1 == "cone"){
        geos[0].update(coneA1, coneB1, conePhase1, coneHeight1, coneZ1);
        if (geo2 == "plane"){
            geos[1].update(planeSize2, angle);
            geos[0].intersectPlane(geos[1].getNormal(), coneA1, coneB1, coneHeight1, conePhase1, coneZ1, pts);
            // geos[0].unwrapPts(pts, unwrappedPts);
        } else if (geo2 == "cylinder"){
            geos[1].update(cylA2, cylB2, cylPhase2, cylHeight2, angle, cylX2);
            // geos[0].unwrapPts(pts, unwrappedPts);
        } else if (geo2 == "cone"){
            geos[1].update(coneA2, coneB2, conePhase2, coneHeight2, coneZ2, angle, coneX2);
        }
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