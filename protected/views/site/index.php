<?php
$base_url = Yii::app()->request->baseUrl;
$cs = Yii::app()->clientScript;
$cs->registerScriptFile($base_url . '/js/menu.js', CClientScript::POS_BEGIN);
$cs->registerScriptFile($base_url . '/js/visualization.js', CClientScript::POS_BEGIN);
$cs->registerScriptFile($base_url . '/js/dataLoader.js', CClientScript::POS_BEGIN);
$cs->registerScriptFile($base_url . '/select2/select2.min.js', CClientScript::POS_BEGIN);
?>
<script type="text/javascript">
    var viz;
    $(function() {
        $('.modal').show();

        $('#golfMenu').menu({
            onMenuItemClicked: function(mode) {
                viz.onModeChanged(mode);
            }
        });

        $.get("/get-players", function(_list) {
            $('#formFields').append($(_list));
            $('#yearSelect, #playerSelect').select2();

            $('#playerSelect').on("change", function(e) {
                $('.modal').show();
                $.dataLoader({
                    params: '/' + e.val,
                    onDataLoad: function(data) {
                        viz.onDataChanged(data);
                        $('.modal').hide();
                    }
                });
            });
        });

        $('input[type="checkbox"]').change(function() {
            viz.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
        });

        $.dataLoader({
            onDataLoad: function(data) {
                $('.modal').hide();
                $('.menu-item:first').animate({opacity: 1}).attr('class', 'menu-item clicked');
                viz = $('#golfViz').visualize({
                    data: data,
                    mode: 'SCORE_MODE',
                    keySelector: '#golfKey',
                    parButtonColumnSelector: '#parButtonColumn'
                });
            }
        });
    });
</script>
<div class="modal"></div>
<div class='row'>
    <div class="col-md-3" style="height: 105px;">
        <div class="row">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="250" preserveAspectRatio="xMidYMid meet" id="golfMenu"></svg>
        </div>
        <div class="row">
            <div style="height: 25px; visibility: hidden;" id="parButtonColumn">
                <div class="btn-group  btn-group-xs toggle-button" data-toggle="buttons">
                    <label class="btn btn-default active">
                        <input type="checkbox" id="par3" checked=checked> Par 3
                    </label>
                    <label class="btn btn-default active">
                        <input type="checkbox" id="par4" checked=checked> Par 4
                    </label>
                    <label class="btn btn-default active">
                        <input type="checkbox" id="par5" checked=checked> Par 5
                    </label>
                </div>
            </div>        
        </div>
    </div>
    <div class="col-md-5" style="height: 105px;">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="500" preserveAspectRatio="xMidYMid meet" id="golfKey"></svg>
    </div>
    <div class="col-md-4" style="height: 105px;">
        <div id="formFields" style="margin: 30px 0px 0px 0px">
            <select id="yearSelect" name="year" data-placeholder="Select Year" >
                <option value="2013" selected="selected">2013</option>
            </select> &nbsp;&nbsp;
        </div>
    </div>
</div>
<hr/>

<div class='row'>
    <div class='col-md-12'>
        <svg id="golfViz" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="650"></svg>
    </div>
</div>
<hr/>
