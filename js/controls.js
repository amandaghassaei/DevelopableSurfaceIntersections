/**
 * Created by ghassaei on 10/7/16.
 */


function initControls(){

    setSliderInput("#cylinderA", cylA, 0.1, 50, 0.1, function(val){
        cylA = val;
        updateCylinder();
    });
    setSliderInput("#cylinderB", cylB, 0.1, 50, 0.1, function(val){
        cylB = val;
        updateCylinder();
    });

    setSliderInput("#planeAngle", planeAngle, 0.0, Math.PI*2, 0.1, function(val){
        planeAngle = val;
        updateCylinder();
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
        $(".radio>input[value="+val+"]").prop("checked", true);
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
