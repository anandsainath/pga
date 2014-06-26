var round_details;
var puttDetails = [];
var scoreDetails = [];
var greenSideBunker = [];

var space_between_courses = 20;
var course_width = 50;
var holesPerLine;

$(function() {
    init();
    $('#loadBtn').click(function() {
        holesPerLine = parseInt($('#holesPerLine').val());
        fetchData($("#player").val(), $('#round').val());
    });
});

function init() {
    holesPerLine = parseInt($('#holesPerLine').val());
    fetchData($("#player").val(), $('#round').val());
}

function fetchData(id, round) {
    $('.modal').show();
    puttDetails = [];
    scoreDetails = [];
    greenSideBunker = [];

    $('.scoreElement, .golfCourse, .ball, .greenSideBunker').remove();
    d3.json('./data/data.php?id=' + id + '&round=' + round, loadData);
}

function loadData(_data) {
    var data = _data.holeDetails;
    $('.modal').hide();
    round_details = data;

    var svg = d3.select("#golf-viz svg");
    svg.selectAll(".golfCourse").data(round_details).enter()
            .append("use")
            .attr("class", "golfCourse")
            .attr("id", function(datum, index) {
                return "hole" + (index + 1);
            })
            .attr("xlink:href", function(datum, index) {
                var id = "#par" + datum.par;

                if (datum.fir == 1) {
                    id += "F";
                } else if (datum.rough) {
                    id += datum.rough;
                }

                if (datum.gir == 1) {
                    id += "G";
                }
                //adding contents to the putt details and shot details array!
                addPuttDetails(index, datum);
                var diff = datum.par - datum.score;
                if (diff != 0) {
                    addScoreDetails(index, diff);
                }
                if (typeof (datum.greenSideBunker) != undefined) {
                    addGreenSideBunkerDetails(index, datum.par, datum.greenSideBunker);
                }
                //returning the string that will represent the ID of the use element
                return id;
            })
            .attr("x", function(datum, index) {
                return getXOffset(index);
            })
            .attr("y", function(datum, index) {
                return getYOffset(index);
            });

    svg.selectAll(".greenSideBunker").data(greenSideBunker).enter()
            .append("use")
            .attr("class", "greenSideBunker")
            .attr("xlink:href", function(datum, index) {
                return "#" + datum.type;
            })
            .attr("x", function(datum, index) {
                return datum.x;
            })
            .attr("y", function(datum, index) {
                return datum.y;
            });

    svg.selectAll(".ball").data(puttDetails).enter()
            .append("use")
            .attr("class", "ball")
            .attr("xlink:href", "#golfBall")
            .attr("x", function(datum, index) {
                return datum.x;
            })
            .attr("y", function(datum, index) {
                return datum.y;
            });

    svg.selectAll(".scoreElement").data(scoreDetails).enter()
            .append("use")
            .attr("class", "scoreElement")
            .attr("xlink:href", function(datum, index) {
                return datum.type;
            })
            .attr("x", function(datum, index) {
                return datum.x;
            })
            .attr("y", function(datum, index) {
                return datum.y;
            });
}

function addGreenSideBunkerDetails(index, parValue, bunkerDetails) {
    for (bunkerType in bunkerDetails) {
        var bunker = new Object();
        bunker.x = getXOffset(index);
        bunker.y = getYOffset(index) - getFairwayHeight(parValue);
        bunker.type = bunkerDetails[bunkerType] + "";
        console.log(bunker);
        greenSideBunker.push(bunker);
    }
}

function getFairwayHeight(parValue) {
    switch (parValue) {
        case 3:
            return 15;
        case 4:
            return 60;
        case 5:
            return 105;
    }
}

function addScoreDetails(index, diff) {
    var score = new Object();
    score.x = getXOffset(index) + (course_width / 2);
    score.y = getYOffset(index) + 25;

    switch (diff) {
        case -2:
            score.type = "#doubleBogey";
            var score2 = Object.create(score);
            score2.type = "#bogey";
            scoreDetails.push(score);
            scoreDetails.push(score2);
            break;
        case -1:
            score.type = "#bogey";
            scoreDetails.push(score);
            break;
        case 1:
            score.type = "#birdie";
            scoreDetails.push(score);
            break;
        case 2:
            score.type = "#birdie";
            var score2 = Object.create(score);
            score2.type = "#eagle";
            scoreDetails.push(score2);
            scoreDetails.push(score);
            break;
    }
}

function addPuttDetails(index, datum) {
    var x = getXOffset(index);
    var y = getYOffset(index);
    switch (datum.putts) {
        case 1:
            var putt = new Object();
            putt.x = x + (course_width / 2);
            putt.y = (y - getYOffsetForBall(datum.par));
            puttDetails.push(putt);
            break;
        case 2:
            var putt1 = new Object();
            var putt2 = new Object();
            putt1.x = x + 15;
            putt2.x = x + 35;

            putt2.y = putt1.y = (y - getYOffsetForBall(datum.par));
            puttDetails.push(putt1);
            puttDetails.push(putt2);
            break;
        case 3:
            var putt1 = new Object();
            var putt2 = new Object();
            var putt3 = new Object();
            putt1.x = x + 9;
            putt2.x = putt1.x + 16;
            putt3.x = putt2.x + 16;

            putt3.y = putt2.y = putt1.y = (y - getYOffsetForBall(datum.par));
            puttDetails.push(putt1);
            puttDetails.push(putt2);
            puttDetails.push(putt3);
            break;
    }
}

function getYOffsetForBall(parValue) {
    switch (parValue) {
        case 3:
            return 37.5;
        case 4:
            return 82.5;
        case 5:
            return 127.5;
    }
}

function getXOffset(index) {
    var holeOffset = (index > holesPerLine) ? index - (holesPerLine + 1) : index;
    return (course_width * holeOffset) + (space_between_courses * (holeOffset + 1));
}

function getYOffset(index) {
    return (index > holesPerLine) ? 400 : 200;
}