var scoreTextWidth = 40;
var puttTextWidth = 16;
var puttTextHeight = 31;
var horizontalPadding = 15;
var noteWidth = 17;
var noteHeight = 17;
var multiplierTextWidth = 19;
var multiplierTextHeight = 17; 
var holesPerLine;


$(function(){
	init();
	$('#loadBtn').click(function(){
		//holesPerLine = parseInt($('#holesPerLine').val());
		holesPerLine = 8;
		fetchData($("#player").val(), $('#round').val());
	});
});

function init(){
	//holesPerLine = parseInt($('#holesPerLine').val());
	holesPerLine = 8;
	fetchData($("#player").val(), $('#round').val());
}

function fetchData(id, round){
	$('.modal').show();
	$('.note, .scoreText, .puttText, .fir, .gir, .roughIndicator').remove();
	d3.json('./data/data.php?id='+id+'&round='+round, loadData);
}

function loadData(_data){
	var data = _data.holeDetails;
	$('.modal').hide();
	var fir = [];
	var gir = [];
	var sandSave = [];
	var greenSideBunker = [];
	var rough = [];

	var svg = d3.select("#golf-viz svg");
	svg.selectAll(".scoreText").data(data).enter()
		.append("text")
		.attr("class", function(datum, index){
			if(datum.fir == 1){
				fir.push(index);
			}
			if(datum.gir == 1){
				gir.push(index);
			}
			if(parseInt(datum.sandSaveCount) > 0){
				sandSave.push({"index": index, "value":datum.sandSaveCount});
			}
			if(parseInt(datum.greenSideBunkerCount) > 0){
				greenSideBunker.push({"index": index, "value":datum.greenSideBunkerCount});	
			}
			if(typeof(datum.rough) != undefined){
				var xOffset = getXOffset(index);
				var yOffset = getYOffset(index);
				var points;
				switch(datum.rough){
					case "RR":
						//points = xOffset +","+yOffset+" "+xOffset+","+(yOffset-10)+" "+(xOffset+8.5)+","+(yOffset-5);
						points = xOffset +","+yOffset+" "+xOffset+","+(yOffset-15)+" "+(xOffset+13)+","+(yOffset-7.5);
					break;
					case "LR":
						//points = xOffset+","+(yOffset-5)+" "+(xOffset+8.5)+","+yOffset+" "+(xOffset+8.5)+","+(yOffset-10);
						points = xOffset+","+(yOffset-7.5)+" "+(xOffset+13)+","+yOffset+" "+(xOffset+13)+","+(yOffset-15);
					break;
				}
				rough.push({"points":points});	
			}
			return "scoreText " + getScoreClass(datum.par - datum.score);
		})
		.attr("x", function(datum, index){
			return getXOffset(index) + (noteWidth/*+multiplierTextWidth*/);
		})
		.attr("y", function(datum, index){
			return getYOffset(index);
		})
		.text(function(datum, index){
			return datum.score;
		});

	svg.selectAll(".roughIndicator").data(rough).enter()
		.append("polygon")
		.attr("class","roughIndicator")
		.attr("points", function(datum, index){
			return datum.points;
		});

	svg.selectAll(".sandSave").data(sandSave).enter()
		.append("text")
		.attr("class","note sandSave")
		.text(function(datum, index){
			return "SS";
		})
		.attr("x", function(datum, index){
			return getXOffset(datum.index);
		})
		.attr("y", function(datum, index){
			return getYOffset(datum.index) - 46;
		});

	/*svg.selectAll(".sscount").data(sandSave).enter()
		.append("text")
		.attr("class","note count sscount")
		.text(function(datum, index){
			return "X"+datum.value;
		})
		.attr("x", function(datum, index){
			return getXOffset(datum.index) + noteWidth;
		})
		.attr("y", function(datum, index){
			return getYOffset(datum.index) - 46;
		});*/

	svg.selectAll(".greenSideBunker").data(greenSideBunker).enter()
		.append("text")
		.attr("class","note greenSideBunker")
		.text(function(datum, index){
			return "GB";
		})
		.attr("x", function(datum, index){
			return getXOffset(datum.index);
		})
		.attr("y", function(datum, index){
			return getYOffset(datum.index) - 46 + multiplierTextHeight;
		});

	/*svg.selectAll(".gbcount").data(greenSideBunker).enter()
		.append("text")
		.attr("class","note count gbcount")
		.text(function(datum, index){
			return "X"+datum.value;
		})
		.attr("x", function(datum, index){
			return getXOffset(datum.index) + noteWidth;
		})
		.attr("y", function(datum, index){
			return getYOffset(datum.index) - 46 + multiplierTextHeight;
		});*/

	svg.selectAll(".puttText").data(data).enter()
		.append("text")
		.attr("class","puttText")
		.attr("x", function(datum, index){
			return getXOffset(index) + scoreTextWidth  + (noteWidth/*+multiplierTextWidth*/);
		})
		.attr("y", function(datum, index){
			return getYOffset(index);
		})
		.text(function(datum, index){
			return datum.putts;
		});

	svg.selectAll(".fir").data(fir).enter()
		.append("circle")
		.attr("class","fir")
		.attr("r",6)
		.attr("cx", function(datum, index){
			return getXOffset(datum) + (scoreTextWidth + (puttTextWidth/2))  + (noteWidth/*+multiplierTextWidth*/);
		})
		.attr("cy", function(datum, index){
			return getYOffset(datum) - (puttTextHeight);
		});

	svg.selectAll(".gir").data(gir).enter()
		.append("circle")
		.attr("class","gir")
		.attr("r",6)
		.attr("cx", function(datum, index){
			return getXOffset(datum) + (scoreTextWidth + (puttTextWidth/2))  + (noteWidth/*+multiplierTextWidth*/);
		})
		.attr("cy", function(datum, index){
			return getYOffset(datum) - (puttTextHeight + 15);
		});

	displayTotalSummary(svg, _data.summary);
}

function displayTotalSummary(svg, summary){
	var yOffset = 360;
	var xOffset = 300;

	svg.append("text").attr("class","note sandSave")
		.attr("x", xOffset)
		.attr("y", yOffset-46)
		.text("SS");

	svg.append("text").attr("class","note count .summarySSCount")
		.attr("x", xOffset+noteWidth)
		.attr("y", yOffset-46)
		.text("X"+summary.ss);

	svg.append("text").attr("class","note greenSideBunker")
		.attr("x", xOffset)
		.attr("y", yOffset-46+multiplierTextHeight)
		.text("GB");

	svg.append("text").attr("class","note count .summaryGBCount")
		.attr("x", xOffset+noteWidth)
		.attr("y", yOffset-46+multiplierTextHeight)
		.text("X"+summary.gb);

	xOffset -= 33;
	var lrPoints = xOffset+","+(yOffset-7.5)+" "+(xOffset+13)+","+yOffset+" "+(xOffset+13)+","+(yOffset-15);
	svg.append("polygon").attr("class","roughIndicator")
		.attr("points",lrPoints);

	svg.append("text").attr("class","note count .summaryGBCount")
		.attr("x", xOffset+15)
		.attr("y", yOffset-3)
		.text("X"+summary.lr);

	xOffset +=36;
	var rrPoints = xOffset +","+yOffset+" "+xOffset+","+(yOffset-15)+" "+(xOffset+13)+","+(yOffset-7.5);
	svg.append("polygon").attr("class","roughIndicator")
		.attr("points",rrPoints);

	svg.append("text").attr("class","note count .summaryGBCount")
		.attr("x", xOffset+15)
		.attr("y", yOffset-3)
		.text("X"+summary.rr);

	xOffset +=36;
	svg.append("text").attr("class","scoreText")
		.attr("x", xOffset)
		.attr("y", yOffset)
		.text(summary.score);

	xOffset +=78;
	svg.append("text").attr("class","scoreText puttText")
		.attr("x", xOffset)
		.attr("y", yOffset)
		.text(summary.putt);

	xOffset += 15;
	yOffset -= 31;

	svg.append("circle")
		.attr("class","fir")
		.attr("r",6)
		.attr("cx", xOffset)
		.attr("cy", yOffset);

	svg.append("text").attr("class","note count .summaryFIRCount")
		.attr("x", xOffset+13)
		.attr("y", yOffset+5)
		.text("X"+summary.fir);

	yOffset -=20;
	svg.append("circle")
		.attr("class","gir")
		.attr("r",6)
		.attr("cx", xOffset)
		.attr("cy", yOffset);

	svg.append("text").attr("class","note count .summaryGIRCount")
		.attr("x", xOffset+13)
		.attr("y", yOffset+5)
		.text("X"+summary.gir);

}

function getScoreClass(diff){
	switch(diff){
		case -2:
			return "doubleBogey";			
		case -1:
			return "bogey";
		case 0:
			return "par";
		case 1:
			return "birdie";
		case 2:
			return "eagle";
	}
}

function getXOffset(index){
	var holeOffset = (index > holesPerLine) ? index-(holesPerLine+1) : index;
  	return (holeOffset*(scoreTextWidth+puttTextWidth)) + ((holeOffset+1)*horizontalPadding) + (holeOffset * (noteWidth/*+multiplierTextWidth*/));
}

function getYOffset(index){
	return (index > holesPerLine)? 240:120;
}