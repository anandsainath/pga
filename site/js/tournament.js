//color scale for the heatmaps.
var negativeColor = ["#FEE6CE", "#FDD0A2", "#FDAE6B", "#FD8D3C", "#F16913", "#D94801", "#A63603", "#7F2704"],
	positiveColor = ["#9ECAE1", "#6BAED6", "#4292C6", "#2171B5", "#08519C", "#08306B"];


var bogeyColorSwatch = ["#9ECAE1","#4292C6","#08519C"],
	birdieColorSwatch = ["#FEE6CE","#FDAE6B","#D94801"],
	parColorSwatch = "#D9D9D9",
	fwyColor = "#41AB5D",
	fwyMissedColor = "#D9D9D9",
	girColor = "#006D2C",
	girMissedColor = "#D9D9D9",
	puttsColorSwatch = ["#FFFFBF","#74ADD1","#D9D9D9","#D73027"];

function getSummaryColor(diff){
	if(diff < 0){
		return negativeColor[Math.abs(Math.max(diff, -8))-1];
	}else if(diff > 0){
		return positiveColor[Math.abs(Math.min(diff, 6))-1];
	}else if(diff == 0){
		return parColorSwatch;
	}
}

function bogeyColor(position){
	position = Math.abs(position);
	switch(position){
		case 1:
		case 2:
		case 3:
			return bogeyColorSwatch[position];
		default:
			return bogeyColorSwatch[3];
	}
}

function birdieColor(position){
	position = Math.abs(position);
	switch(position){
		case 1:
		case 2:
		case 3:
			return birdieColorSwatch[position];
		default:
			return birdieColorSwatch[3];
	}
}


/*** MODE Constants ***/

var SUMMARY_MODE = "overall";
var FIR_MODE = "fir2";
var FIR_THREE_MODE = "fir3";
var GIR_MODE = "gir";
var PUTT_MODE = "putt";
var HOLE_BY_HOLE = "holeByhole";
var parColor = "#FEF0D9";

var data = undefined;
var mode = SUMMARY_MODE,
	par3 = true,
	par4 = true,
	par5 = true;

var roundWidth = 180,
	roundPadding = 5,
	roundHeight = 15,
	tournamentPadding = 8,
	topMargin = 15;

var nextTournamentLocation = roundHeight + tournamentPadding;

function renderOverallKey(){
	var $ul = $('#overall_key > ul');
	for(var score=62; score<=76; score++){
		var color = (score == 70)? parColorSwatch : getSummaryColor(score-70);
		$ul.append('<li> <span class="color-box" style="background: '+color+';"></span> '+score+'</li>');
	}
}

function fetchData(id){
	$('.modal').show();
	renderOverallKey();
	d3.json('./data/data_tournament.php?id='+id, saveNLoadData);
}

function saveNLoadData(_data){
	data = _data;
	$('#overall').trigger('click');
}

function removeAllViews(){
	$('.tournaments').remove();
}

function loadFlags(mode){
	if(!mode){
		mode = SUMMARY_MODE;
	}
	par3 = $('#par3').prop('checked');
	par4 = $('#par4').prop('checked');
	par5 = $('#par5').prop('checked');
}

function drawHole(round, holeDetails, styleFunction){
	var oneToSeventeenHoles = [];
	$.each(holeDetails, function(index, datum){
		if((datum.par == 3 && par3) || (datum.par == 4 && par4) || (datum.par == 5 && par5)){
			if(index == 0){
				round.selectAll('.roundSummaryL').data([datum]).enter()
					.append("path")
					.attr("class", "roundSummaryL")
					.attr("d", leftRoundedRect(0,0, (roundWidth/18), roundHeight, 5))
					.attr("style", styleFunction);
			} else if(index == 17){
				round.selectAll('.roundSummaryR').data([datum]).enter()
					.append("path")
					.attr("class", "roundSummaryR")
					.attr("d", rightRoundedRect(17 * (roundWidth/18),0, (roundWidth/18), roundHeight, 5))
					.attr("style", styleFunction);
			} else{
				datum.index = index;
				oneToSeventeenHoles.push(datum);
			}
		}
	});

	round.selectAll('.roundSummary')
		.data(oneToSeventeenHoles).enter()
		.append("rect")
		.attr("class","roundSummary")
		.attr("x", function(datum, index){
			return (datum.index) * (roundWidth/18);
		})
		.attr("y", 0)
		.attr("width", (roundWidth/18))
		.attr("height", roundHeight)
		.attr("style", styleFunction);
}

// Returns path data for a rectangle with rounded right corners.
// The top-left corner is ⟨x,y⟩.
function rightRoundedRect(x, y, width, height, radius) {
  	return rounded_rect(x, y, width, height, radius, false, true, false, true);	
}

function leftRoundedRect(x, y, width, height, radius){
	return rounded_rect(x, y, width, height, radius, true, false, true, false);
}

function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
    var retval;
    retval  = "M" + (x + r) + "," + y;
    retval += "h" + (w - 2*r);
    if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
    else { retval += "h" + r; retval += "v" + r; }
    retval += "v" + (h - 2*r);
    if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
    else { retval += "v" + r; retval += "h" + -r; }
    retval += "h" + (2*r - w);
    if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
    else { retval += "h" + -r; retval += "v" + -r; }
    retval += "v" + (2*r - h);
    if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
    else { retval += "v" + -r; retval += "h" + r; }
    retval += "z";
    return retval;
}

function loadData(mode){
	$('.modal').hide();
	loadFlags(mode);
	var svg = d3.select("#golf-viz svg");

	svg.selectAll(".tournaments").data(data).enter()
		.append("g")
		.attr("class","tournaments")
		.attr("transform", function(datum, index){
			return "translate(0,"+(index*nextTournamentLocation + topMargin)+")";
		})
		.each(function(){
			var tournament = d3.select(this);
			var tournamentName = arguments[0].name;
			tournament.selectAll('.round').data(arguments[0].eventSummary).enter()
				.append("g")
				.attr("class","round")
				.attr("transform", function(datum, index){
					//console.log(datum);
					var x = (index*roundWidth) + ((index+1)*roundPadding);
					return "translate("+x+","+roundHeight+")";
				})
				.attr("id",function(datum, index){
					return tournamentName + index;
				})
				.each(function(){
					var roundNum = arguments[1] + 1;
					var round = d3.select(this);
					//console.log(round, roundNum, arguments[0]);
					var id = round.attr('id');
					
					round.on("mouseover", function(d){
						$('g[id="'+id+'"]').attr('class','round hover-round');
						$('g.round').filter('[id!="'+id+'"]').attr('class','round fade-round');
						
						var nodeSelection = d3.select(this);
						nodeSelection.selectAll('.hover').style({opacity: '1.0'});
					})
					.on("mouseout", function(d){
						$('g[id="'+id+'"]').attr('class','round');
						$('g.round').filter('[id!="'+id+'"]').attr('class','round');

						var nodeSelection = d3.select(this);
						nodeSelection.selectAll('.hover').style({opacity: '0.0'});
					});

					switch(mode){
						case SUMMARY_MODE:
							round.selectAll('.roundSummary')
								.data([arguments[0].roundSummary]).enter()
								.append("rect")
								.attr("rx", 5)
								.attr("ry", 5)
								.attr("class","roundSummary")
								.attr("x", 0)
								.attr("y", 0)
								.attr("width", roundWidth)
								.attr("height", roundHeight)
								.attr("style", function(datum, index){
									var diff = datum.score - datum.par;
									var color = getSummaryColor(diff);
									return "fill:"+color+"; vector-effect: non-scaling-stroke;";
								});
						break;
						case HOLE_BY_HOLE:
							drawHole(round, arguments[0].holeDetails, function(datum, index){
								var diff = datum.score - datum.par;
								var color = (diff == 0)? parColorSwatch : ((diff < 0)? birdieColor(diff) : bogeyColor(diff));
								return "fill:"+color+"; vector-effect: non-scaling-stroke;";
							});
						break;
						case FIR_MODE:
							drawHole(round, arguments[0].holeDetails, function(datum, index){
								var color = (datum.fir == 0)? fwyMissedColor : fwyColor;
								return "fill:"+color+";";
							});
						break;
						case FIR_THREE_MODE:
							drawHole(round, arguments[0].holeDetails, function(datum, index){
								var color = (datum.fir == 0)? ((datum.rough == "LR")? "#9970AB" : "#FDAE61") : fwyColor;
								return "fill:"+color+";";
							});
						break;
						case GIR_MODE:
							drawHole(round, arguments[0].holeDetails, function(datum, index){
								var color = (datum.gir == 0)? girMissedColor : girColor;
								return "fill:"+color+";";
							});
						break;
						case PUTT_MODE:
							drawHole(round, arguments[0].holeDetails, function(datum, index){
								var color = puttsColorSwatch[datum.putts];
								return "fill:"+color+";";
							});
						break;
					}
					

					round.selectAll('.round-details')
						.data([arguments[0].roundSummary]).enter()
						.append("g")
						.attr("class","round-details")
						.attr("transform","translate(200,0)")
						.each(function(){
							var roundDetails = d3.select(this);

							roundDetails.selectAll('.bracket').data([arguments[0]]).enter()
								.append("text")
								.text("{")
								.attr("class","bracket hover")
								.attr("text-anchor","end")
								.attr("x",2)
								.attr("y", 24)
								.attr("fill","#111111")
								.attr("font-size","68px");

							roundDetails.selectAll('.score').data([arguments[0]]).enter()
								.append("text")
								.attr("class","score hover")
								.attr("text-anchor","begining")
								.attr("x", 10)
								.attr("y", -15)
								.attr("fill","#111111")
								.attr("font-size","14px")
								.text(function(datum, index){
									return datum.score;
								})
								.each(function(){
									var fir = d3.select(this);
									fir.append('tspan').attr("class","label").text(" SCORE");
								});

							roundDetails.selectAll('.fir').data([arguments[0]]).enter()
								.append("text")
								.attr("class","fir hover")
								.attr("text-anchor","begining")
								.attr("x", 10)
								.attr("y", 2)
								.attr("fill","#111111")
								.attr("font-size","14px")
								.text(function(datum, index){
									var output = ""+datum.fir;
									if(output.length == 1){
										output = "0"+output;
									}
									return output;
								})
								.each(function(){
									var fir = d3.select(this);
									fir.append('tspan').attr("class","label").text(" FWY");
								});

							roundDetails.selectAll('.gir').data([arguments[0]]).enter()
								.append("text")
								.attr("class","gir hover")
								.attr("text-anchor","begining")
								.attr("x", 10)
								.attr("y", 19)
								.attr("fill","#111111")
								.attr("font-size","14px")
								.text(function(datum, index){
									var output = ""+datum.gir;
									if(output.length == 1){
										output = "0"+output;
									}
									return output;
								})
								.each(function(){
									var fir = d3.select(this);
									fir.append('tspan').attr("class","label").text(" GIR");
								});

							roundDetails.selectAll('.putt').data([arguments[0]]).enter()
								.append("text")
								.attr("class","putt hover")
								.attr("text-anchor","begining")
								.attr("x", 10)
								.attr("y", 36)
								.attr("fill","#111111")
								.attr("font-size","14px")
								.text(function(datum, index){
									return datum.putt;
								})
								.each(function(){
									var fir = d3.select(this);
									fir.append('tspan').attr("class","label").text(" PUTTS");
								});

							
						});
				});

		});
}
