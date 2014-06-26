var scoreHoleByHole, fir2HoleByHole, girHoleByHole, puttsHoleByHole;
$(function() {
    $('.modal').show();
    $("#score-hole-by-hole, #fir2-hole-by-hole, #fir3-hole-by-hole, #gir-hole-by-hole, #putts-hole-by-hole").hide();
    $.dataLoader({
        onDataLoad: function(data) {
            $('.modal').hide();
            var scoreOverall = $('#score-overall').golf({
                svgSelector: '#score-overall',
                data: data,
                mode: "SCORE_MODE"
            });

            scoreHoleByHole = $('#score-hole-by-hole').golf({
                svgSelector: '#score-hole-by-hole',
                data: data,
                mode: "SCORE_HOLE_BY_HOLE_MODE",
                par3: $('#par3').is(":checked"),
                par4: $('#par4').is(':checked'),
                par5: $('#par5').is(":checked")
            });

            $('#fir2-overall').golf({
                svgSelector: '#fir2-overall',
                data: data,
                mode: "FWY2_MODE"
            });

            fir2HoleByHole = $('#fir2-hole-by-hole').golf({
                svgSelector: '#fir2-hole-by-hole',
                data: data,
                mode: "FWY2_HOLE_BY_HOLE_MODE",
                par3: $('#par3').is(":checked"),
                par4: $('#par4').is(':checked'),
                par5: $('#par5').is(":checked")
            });

            $('#fir3-overall').golf({
                svgSelector: '#fir3-overall',
                data: data,
                mode: "FWY3_MODE"
            });

            fir3HoleByHole = $('#fir3-hole-by-hole').golf({
                svgSelector: '#fir3-hole-by-hole',
                data: data,
                mode: "FWY3_HOLE_BY_HOLE_MODE",
                par3: $('#par3').is(":checked"),
                par4: $('#par4').is(':checked'),
                par5: $('#par5').is(":checked")
            });


            $('#gir-overall').golf({
                svgSelector: '#gir-overall',
                data: data,
                mode: "GIR_MODE"
            });

            girHoleByHole = $("#gir-hole-by-hole").golf({
                svgSelector: "#gir-hole-by-hole",
                data: data,
                mode: "GIR_HOLE_BY_HOLE_MODE",
                par3: $('#par3').is(":checked"),
                par4: $('#par4').is(':checked'),
                par5: $('#par5').is(":checked")
            });

            $('#putts-overall').golf({
                svgSelector: "#putts-overall",
                data: data,
                mode: "PUTTS_MODE"
            });

            puttsHoleByHole = $('#putts-hole-by-hole').golf({
                svgSelector: "#putts-hole-by-hole",
                data: data,
                mode: "PUTTS_HOLE_BY_HOLE_MODE",
                par3: $('#par3').is(":checked"),
                par4: $('#par4').is(':checked'),
                par5: $('#par5').is(":checked")
            });
        }
    });

    $('#golfTab a:first').tab('show');

    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        //var $from = $(e.relatedTarget);
        var $to = $(e.target);
        var toID = $to.attr('href');
        refreshParScores(toID);
        $(toID + "-overall").show();
        $(toID + "-hole-by-hole").hide();
        $('#checkboxes').hide();
    });

    function refreshParScores(id) {
        switch (id) {
            case "#score":
                scoreHoleByHole.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
                break;
            case "#fir2":
                fir2HoleByHole.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
                break;
            case "#fir3":
                fir3HoleByHole.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
                break;
            case "#gir":
                girHoleByHole.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
                break;
            case "#putts":
                puttsHoleByHole.onParChanged($('#par3').is(":checked"), $('#par4').is(":checked"), $('#par5').is(":checked"));
                break;
        }
    }

    $('input[type="checkbox"]').change(function() {
        refreshParScores($('#golfTab').find('li.active a').attr('href'));
    });

    $('.js-btn').click(function() {
        var activeTabSelector = $('#golfTab').find('li.active a').attr('href');
        var currentBtnSelector = $(this).attr('id');

        $(activeTabSelector + " .js-content-div").fadeOut('fast', function() {
            $(activeTabSelector + "-" + currentBtnSelector).fadeIn('slow');
            if (currentBtnSelector === "hole-by-hole") {
                $('#checkboxes').show();
            } else {
                $('#checkboxes').hide();
            }
        });
    });
});