/**
 * Created by ghassaei on 10/7/16.
 */


function initControls(){

    setSliderInput("#thetaNum", thetaNum, 10, 400, 1, function(val){
        thetaNum = val;
        initGeos();
    });
    setSliderInput("#ptScale", ptScale, 0.1, 1, 0.1, function(val){
        ptScale = val;
        updateIntersection();
    });
    setSliderInput("#angle", angle, 0.0, Math.PI, 0.1, function(val){
        angle = val;
        updateIntersection();
    });

    setSliderInput("#cylinderA1", cylA1, 0.1, 50, 0.1, function(val){
        cylA1 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderB1", cylB1, 0.1, 50, 0.1, function(val){
        cylB1 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderHeight1", cylHeight1, 100, 500, 1, function(val){
        cylHeight1 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderA2", cylA2, 0.1, 50, 0.1, function(val){
        cylA2 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderB2", cylB2, 0.1, 50, 0.1, function(val){
        cylB2 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderHeight2", cylHeight2, 100, 500, 1, function(val){
        cylHeight2 = val;
        updateIntersection();
    });
    setSliderInput("#cylinderX2", cylX2, -100, 100, 0.1, function(val){
        cylX2 = val;
        updateIntersection();
    });


    setSliderInput("#planeSize1", planeSize1, 100, 1000, 1, function(val){
        planeSize1 = val;
        updateIntersection();
    });
    setSliderInput("#planeSize2", planeSize2, 100, 1000, 1, function(val){
        planeSize2 = val;
        updateIntersection();
    });

    setRadio("geo1", geo1, function(val){
        geo1 = val;
        initGeos();
    });

    setRadio("geo2", geo2, function(val){
        geo2 = val;
        initGeos();
    });


    function setButtonGroup(id, callback){
        $(id+" a").click(function(e){
            e.preventDefault();
            var $target = $(e.target);
            var val = $target.data("id");
            if (val) {
                $(id+" span.dropdownLabel").html($target.html());
                callback(val);
            }
        });
    }

    function setLink(id, callback){
        $(id).click(function(e){
            e.preventDefault();
            callback(e);
        });
    }

    function setRadio(name, val, callback){
        $("input[name=" + name + "]").on('change', function() {
            var state = $("input[name="+name+"]:checked").val();
            callback(state);
        });
        $(".radio>input[name="+name+"][value="+val+"]").prop("checked", true);
    }

    function setInput(id, val, callback, min, max){
        var $input = $(id);
        $input.change(function(){
            var val = $input.val();
            if ($input.hasClass("int")){
                if (isNaN(parseInt(val))) return;
                val = parseInt(val);
            } else {
                if (isNaN(parseFloat(val))) return;
                val = parseFloat(val);
            }
            if (min !== undefined && val < min) val = min;
            if (max !== undefined && val > max) val = max;
            $input.val(val);
            callback(val);
        });
        $input.val(val);
    }

    function setCheckbox(id, state, callback){
        var $input  = $(id);
        $input.on('change', function () {
            if ($input.is(":checked")) callback(true);
            else callback(false);
        });
        $input.prop('checked', state);
    }

    function setSlider(id, val, min, max, incr, callback, callbackOnStop){
        var slider = $(id).slider({
            orientation: 'horizontal',
            range: false,
            value: val,
            min: min,
            max: max,
            step: incr
        });
        slider.on("slide", function(e, ui){
            var val = ui.value;
            callback(val);
        });
        slider.on("slidestop", function(){
            var val = slider.slider('value');
            if (callbackOnStop) callbackOnStop(val);
        })
    }

    function setLogSliderInput(id, val, min, max, incr, callback){

        var scale = (Math.log(max)-Math.log(min)) / (max-min);

        var slider = $(id+">div").slider({
            orientation: 'horizontal',
            range: false,
            value: (Math.log(val)-Math.log(min)) / scale + min,
            min: min,
            max: max,
            step: incr
        });

        var $input = $(id+">input");
        $input.change(function(){
            var val = $input.val();
            if ($input.hasClass("int")){
                if (isNaN(parseInt(val))) return;
                val = parseInt(val);
            } else {
                if (isNaN(parseFloat(val))) return;
                val = parseFloat(val);
            }

            var min = slider.slider("option", "min");
            if (val < min) val = min;
            if (val > max) val = max;
            $input.val(val);
            slider.slider('value', (Math.log(val)-Math.log(min)) / scale + min);
            callback(val, id);
        });
        $input.val(val);
        slider.on("slide", function(e, ui){
            var val = ui.value;
            val = Math.exp(Math.log(min) + scale*(val-min));
            $input.val(val.toFixed(4));
            callback(val, id);
        });
    }

    function setSliderInput(id, val, min, max, incr, callback){

        var slider = $(id+">div").slider({
            orientation: 'horizontal',
            range: false,
            value: val,
            min: min,
            max: max,
            step: incr
        });

        var $input = $(id+">input");
        $input.change(function(){
            var val = $input.val();
            if ($input.hasClass("int")){
                if (isNaN(parseInt(val))) return;
                val = parseInt(val);
            } else {
                if (isNaN(parseFloat(val))) return;
                val = parseFloat(val);
            }

            var min = slider.slider("option", "min");
            if (val < min) val = min;
            if (val > max) val = max;
            $input.val(val);
            slider.slider('value', val);
            callback(val);
        });
        $input.val(val);
        slider.on("slide", function(e, ui){
            var val = ui.value;
            $input.val(val);
            callback(val);
        });
    }
}

