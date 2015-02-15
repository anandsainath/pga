<?php
$base_url = Yii::app()->request->baseUrl;
$cs = Yii::app()->clientScript;
$cs->registerScriptFile($base_url . '/js/visualization.js', CClientScript::POS_BEGIN);
$cs->registerScriptFile($base_url . '/js/dataLoader.js', CClientScript::POS_BEGIN);
?>

<script type="text/javascript">
    var viz;
    $(function() {
        $('.modal').show();

        $.dataLoader({
            onDataLoad: function(data) {
                $('.modal').hide();

                viz = $('#golfViz').visualize({
                    data: data,
                    mode: 'SCORE_MODE',
                    keySelector: '#golfKey',
                    parButtonColumnSelector: '#parButtonColumn'
                });
            }
        });

        $('input[type="checkbox"]').change(function() {
            viz.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
        });

        $('input[name="options"]').change(function() {
            onModeChange();
        });

        $('#viz-type').change(function() {
            onModeChange();
        });

        $(document).on("change", '#playerSelect, #yearSelect', function(e) {
            $('.modal').show();
            $.dataLoader({
                params: '/' + $('#playerSelect').val() + '/' + $('#yearSelect').val(),
                onDataLoad: function(data) {
                    viz.onDataChanged(data);
                    $('.modal').hide();
                }
            });
        });

        function onModeChange() {
            var mode = $('[name="options"]:checked').val();
            var type = $("#viz-type").val();
            var vizMode = "SCORE_MODE";
            switch (mode) {
                case "overall":
                    switch (type) {
                        case "Score":
                            vizMode = "SCORE_MODE";
                            break;
                        case "FWY2":
                            vizMode = "FWY2_MODE";
                            break;
                        case "FWY3":
                            vizMode = "FWY3_MODE";
                            break;
                        case "GIR":
                            vizMode = "GIR_MODE";
                            break;
                        case "Putts":
                            vizMode = "PUTTS_MODE";
                            break;
                    }
                    break;
                case "hole-by-hole":
                    switch (type) {
                        case "Score":
                            vizMode = "SCORE_HOLE_BY_HOLE_MODE";
                            break;
                        case "FWY2":
                            vizMode = "FWY2_HOLE_BY_HOLE_MODE";
                            break;
                        case "FWY3":
                            vizMode = "FWY3_HOLE_BY_HOLE_MODE";
                            break;
                        case "GIR":
                            vizMode = "GIR_HOLE_BY_HOLE_MODE";
                            break;
                        case "Putts":
                            vizMode = "PUTTS_HOLE_BY_HOLE_MODE";
                            break;
                    }
                    break;
            }

            viz.onModeChanged(vizMode);
        }
    });
</script>
<!--<h1 class="page-header">Phil Mickelson <small>2013</small></h1>-->
<div class="row">
    <div class="col-md-10 col-md-offset-1 text-center" style="height: 125px;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="100" width="500" preserveAspectRatio="xMidYMid meet" id="golfKey"></svg>
    </div>
</div>
<div class='row top-divider'>
    <div class='col-md-12'>
        <svg id="golfViz" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="650"></svg>
    </div>
</div>