/**
 * jQuery plugin that takes care of rendering the visualization according
 * to the parameters passed.
 * 
 * Also renders the key to a separate SVG whose selector is specified..
 * @author Anand Sainath <anand.sainath@gatech.edu>
 */
;
(function($, window, document, undefined) {
    $.fn.visualize = function(options) {
        var defaults = {
            /** All the default plugin properties will be declared here **/
            data: undefined, //JSON data of the details to be shown via the visualization.
            svg: undefined, //the svg d3 element will be saved here.
            mode: undefined, //the default mode that the visualization must be shown in..
            keySelector: undefined, //the selector for the key of the visualization will be set here.
            sortDuration: 1000, // total time for the sort animation to complete.
            mouseoverActivationTime: 200,
            par3: true,
            par4: true,
            par5: true,
            fadeOtherRoundsOnHover: false,
            parButtonColumnSelector: undefined,
            dimension: {
                roundWidth: 126,
                roundPadding: 5,
                roundHeight: 15,
                expandedRoundHeight: 25,
                tournamentPadding: 8,
                topMargin: 15
            },
            color: {
                /** Seed colors used in the visualizations **/
                //bogeyColorSwatch: ["#9ECAE1", "#4292C6", "#08519C"],
                //birdieColorSwatch: ["#FEE6CE", "#FDAE6B", "#D94801"],
                //parColorSwatch: "#D9D9D9",
                //bogeyColorSwatch: ['#D7E8E2', "#AFEAD6", "#02A1B7"],
                //birdieColorSwatch: ["#FFECC0", '#FFD060', '#FFAE18'],
                bogeyColorSwatch: ["#fee0d2", "#fc9272", "#ef3b2c"],
                //birdieColorSwatch: ["#e5f5e0", '#a1d99b', '#41ab5d'],
                birdieColorSwatch: ["#c7e9c0", '#31a354', '#006d2c'],
                parColorSwatch: "#EFEFEF",
                //negativeColor: ["#FFF6DF", "#FFECC0", "#FFE3A0", "#FFD980", "#FFD060", "#FFBD21", "#FFB61C", "#FFAE18"],
                //positiveColor: ["#E4EDEA", "#D7E8E2", "#CCECE1", "#BEEADB", "#AFEAD6", "#86d9CF", "#56C7CB", "#02A1B7"],
                negativeColor: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#99000d"],
                positiveColor: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#005a32"],
                placeFontColor: '#ABABAB',
                fwyPositiveColor: ['#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45'],
                fwyNegativeColor: ['#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d'],
                fwy3OverallColorSwatch: [],
                fwy3LeftOverallColorSwatch: [],
                fwy3RightOverallColorSwatch: []
            }
        },
        mode = {
            /** The current mode that the visualization is can
             * be any one of these values, specified by using the
             * mode property while calling the plugin. **/
            score: {
                overall: "SCORE_MODE",
                holeByHole: "SCORE_HOLE_BY_HOLE_MODE"
            },
            fwy: {
                twoColor: {
                    overall: "FWY2_MODE",
                    holeByHole: "FWY2_HOLE_BY_HOLE_MODE"
                },
                threeColor: {
                    overall: "FWY3_MODE",
                    holeByHole: "FWY3_HOLE_BY_HOLE_MODE"
                }
            },
            gir: {
                overall: "GIR_MODE",
                holeByHole: "GIR_HOLE_BY_HOLE_MODE"
            },
            putt: {
                overall: "PUTTS_MODE",
                holeByHole: "PUTTS_HOLE_BY_HOLE_MODE"
            }
        },
        opts = $.extend(true, {}, defaults, options);
        /** Generating the overall color swatch for parSummary Colors **/
        var fwySeedColorSwatch = ["#555555", "#787878", "#929292", "#ADADAD", "#CBCBCB", "#E1E1E1", "#F3F3F3"];
        var fwySummaryColors = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / (fwySeedColorSwatch.length - 1)))
                .range(fwySeedColorSwatch);
        var fwyRange = d3.scale.linear().domain([0, 14]).range([0, 1]);
        opts.fwy3OverallColorSwatch = [];
        for (var i = 0; i <= 14; i++) {
            opts.fwy3OverallColorSwatch.push(fwySummaryColors(fwyRange(i)));
        }

        var leftSeedColorSwatch = ["#fee7dc", "#fccab5", "#fcaa91", "#fc8a71", "#f2665b", "#d64a4e", "#b94449"];
        var leftSummaryColors = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / (leftSeedColorSwatch.length - 1)))
                .range(leftSeedColorSwatch);
        var leftRange = d3.scale.linear().domain([0, 14]).range([0, 1]);
        opts.fwy3LeftOverallColorSwatch = [];
        for (var i = 0; i <= 14; i++) {
            opts.fwy3LeftOverallColorSwatch.push(leftSummaryColors(leftRange(i)));
        }

        var rightSeedColorSwatch = ["#e5eff8", "#d2e3f2", "#b3d5e7", "#8bbfdf", "#6caad2", "#5190c5", "#3f77b2"];
        var rightSummaryColors = d3.scale.linear()
                .domain(d3.range(0, 1, 1.0 / (rightSeedColorSwatch.length - 1)))
                .range(rightSeedColorSwatch);
        var rightRange = d3.scale.linear().domain([0, 14]).range([0, 1]);
        opts.fwy3RightOverallColorSwatch = [];
        for (var i = 0; i <= 14; i++) {
            opts.fwy3RightOverallColorSwatch.push(rightSummaryColors(rightRange(i)));
        }

        var publicMethods = {
            /** All methpds that can be exposed to the client
             * will be declared here **/
            onModeChanged: function(newMode) {
                opts.mode = newMode;
                $('#' + opts.svgSelector).empty();
                $(opts.keySelector).empty();
                privateMethods.drawColumnHeaders();
                privateMethods.drawViz();
                privateMethods.addInteractions();
                privateMethods.renderKey();
                privateMethods.showHideParSelectors();
                publicMethods.onParChanged(opts.par3, opts.par4, opts.par5);
                if (opts.sortedColumn) {
                    var arrow;
                    if (opts.sortedColumn.indexOf('Round') !== -1) {
                        arrow = opts.svg.selectAll('.sortArrow');
                    } else {
                        arrow = opts.svg.selectAll('.columnSortArrow');
                    }

                    arrow.each(function(data) {
                        var roundLabel = (data.name) ? data.name : data;
                        if (roundLabel === opts.sortedColumn) {
                            if (opts.sortOrder) {
                                d3.select(this).attr('xlink:href', '/images/sort_up.png').attr('data-sort', 'descending');
                            } else {
                                d3.select(this).attr('xlink:href', '/images/sort_down.png').attr('data-sort', 'ascending');
                            }
                        }
                    });
                }
            },
            onParChanged: function(par3, par4, par5) {
                opts.svg.selectAll('.holeSummary, .holeSummaryL, .holeSummaryR').each(function(o) {
                    var thisOpacity;
                    switch (o.par) {
                        case 3:
                            thisOpacity = (par3) ? 'visible' : 'hidden';
                            break;
                        case 4:
                            thisOpacity = (par4) ? 'visible' : 'hidden';
                            break;
                        case 5:
                            thisOpacity = (par5) ? 'visible' : 'hidden';
                            break;
                    }
                    $(this).css({visibility: thisOpacity});
                });
                opts.par3 = par3;
                opts.par4 = par4;
                opts.par5 = par5;
            },
            onDataChanged: function(data) {
                $('#' + opts.svgSelector).empty();
                $(opts.keySelector).empty();
                opts.data = data;
                privateMethods.resetSize();
                privateMethods.drawColumnHeaders();
                privateMethods.drawViz();
                privateMethods.renderKey();
                privateMethods.addInteractions();
            }
        };
        var privateMethods = {
            /** All the private methods will be declared here **/
            showHideParSelectors: function() {
                switch (opts.mode) {
                    case mode.score.overall:
                    case mode.fwy.threeColor.overall:
                    case mode.fwy.twoColor.overall:
                    case mode.gir.overall:
                    case mode.putt.overall:
                        $(opts.parButtonColumnSelector).css({visibility: 'hidden'});
                        break;
                    case mode.score.holeByHole:
                    case mode.fwy.threeColor.holeByHole:
                    case mode.fwy.twoColor.holeByHole:
                    case mode.gir.holeByHole:
                    case mode.putt.holeByHole:
                        $(opts.parButtonColumnSelector).css({visibility: 'visible'});
                        break;
                }
            },
            drawColumnHeaders: function() {
                var svg = opts.svg;
                var columnTimeOut, columnArrowTimeOut;
                svg.selectAll('.roundLables').data(["Round 1", "Round 2", "Round 3", "Round 4"]).enter()
                        .append("text")
                        .text(function(datum) {
                            return datum;
                        })
                        .attr("x", "0")
                        .attr("y", "15")
                        .attr("class", "roundLables")
                        .attr("text-anchor", "middle")
                        .attr("font-size", "10px")
                        .attr("style", "fill: #000000;")
                        .attr("transform", function(datum, index) {
                            var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                            x += (opts.dimension.roundWidth / 2);
                            return "translate(" + x + ",0)";
                        })
                        .on("mouseover", function(o) {
                            columnTimeOut = setTimeout(function() {
                                columnTimeOut = null;
                                privateMethods.onRoundMouseOver(opts.svg, o);
                            }, opts.mouseoverActivationTime);
                        })
                        .on("mouseout", function(o) {
                            if (columnTimeOut) {
                                clearTimeout(columnTimeOut);
                            } else {
                                privateMethods.onRoundMouseOut(opts.svg);
                            }
                        })
                        .on("click", function(selectedRound) {
                            privateMethods.onRoundClicked(d3.select(this), opts.svg, selectedRound);
                        });
                svg.selectAll('.sortArrow').data(["Round 1", "Round 2", "Round 3", "Round 4"]).enter()
                        .append("image")
                        .attr("class", "sortArrow")
                        .attr("transform", function(datum, index) {
                            var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                            x += (opts.dimension.roundWidth / 2);
                            return "translate(" + x + ",0)";
                        })
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("xlink:href", "/images/sort_neutral.png")
                        .attr("x", "24")
                        .attr("y", "6")
                        .attr("width", "7")
                        .attr("height", "10")
                        .on("mouseover", function(o) {
                            columnArrowTimeOut = setTimeout(function() {
                                columnArrowTimeOut = null;
                                privateMethods.onRoundMouseOver(opts.svg, o);
                            }, opts.mouseoverActivationTime);
                        })
                        .on("mouseout", function(o) {
                            if (columnArrowTimeOut) {
                                clearTimeout(columnArrowTimeOut);
                            } else {
                                privateMethods.onRoundMouseOut(opts.svg);
                            }
                        })
                        .on("click", function(selectedRound) {
                            privateMethods.onRoundClicked(d3.select(this), opts.svg, selectedRound);
                        });
                var _columnHeaderData = [
                    {name: "Position", attributeName: "finishPosition"},
                    {name: "Total", attributeName: "underPar"},
                    {name: "Strokes", attributeName: "totalScore"}
                ];
                svg.selectAll('.columnHeader').
                        data(_columnHeaderData).enter()
                        .append("text")
                        .text(function(datum, index) {
                            return datum.name;
                        })
                        .attr("class", "columnHeader")
                        .attr("text-anchor", "begin")
                        .attr("style", "fill: #000000;")
                        .attr("x", function(datum, index) {
                            var xpos = 50 * index;
                            if (index === 1) {
                                xpos += 10;
                            }
                            return xpos;
                        })
                        .attr("y", "15")
                        .attr("font-size", "10px")
                        .attr("transform", "translate(724, 0)")
                        .on("click", function(datum) {
                            var _this = d3.select(this);
                            privateMethods.sort(_this, datum.name, datum.attributeName);
                        });
                svg.selectAll('.columnSortArrow')
                        .data(_columnHeaderData).enter()
                        .append("image")
                        .attr("class", "columnSortArrow")
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("xlink:href", "/images/sort_neutral.png")
                        .attr("transform", "translate(724, 0)")
                        .attr("x", function(datum, index) {
                            var xpos = ((index + 1) * 50) - 10;
                            if (index === 1) {
                                xpos -= 5;
                            }
                            return xpos;
                        })
                        .attr("y", 7)
                        .attr("width", "7")
                        .attr("height", "10");
                svg.data([{name: "Sort by Date", attributeName: "tournamentID"}])
                        .append('text')
                        .text(function(datum) {
                            return datum.name;
                        })
                        .attr("class", "columnHeader")
                        .attr("text-anchor", "end")
                        .attr("style", "fill: #000000;")
                        .attr("font-size", "10px")
                        .attr("x", 159)
                        .attr("y", 15)
                        .on("click", function(datum) {
                            var _this = d3.select(this);
                            privateMethods.sort(_this, datum.name, datum.attributeName);
                        });
                svg.data([{name: "Sort by Date", attributeName: "tournamentID"}])
                        .append("image")
                        .attr("class", "columnSortArrow")
                        .attr("preserveAspectRatio", "xMidYMid meet")
                        .attr("xlink:href", "/images/sort_down.png")
                        .attr("x", 164)
                        .attr("y", 7)
                        .attr("width", "7")
                        .attr("height", "10");
            },
            onRoundClicked: function(_this, svg, selectedRound) {
                svg.selectAll('.roundLables, .columnHeader').each(function() {
                    if (arguments[0] !== selectedRound) {
                        d3.select(this).attr('data-sort', null);
                    }
                });
                opts.sortedColumn = _this.data()[0];
                var data_sort = _this.attr('data-sort');
                var roundIndex = parseInt(selectedRound.slice(-1));
                var sortOrder;
                if (data_sort === null || data_sort === 'descending') {
                    _this.attr('data-sort', 'ascending');
                    sortOrder = true;
                } else if (data_sort === 'ascending') {
                    _this.attr('data-sort', 'descending');
                    sortOrder = false;
                }
                opts.sortOrder = sortOrder;
                /** Different Sorting functions **/
                sortItemsOnRoundScore = function(a, b) {
                    if (sortOrder) {
                        var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : a.eventSummary[roundIndex - 1].roundSummary.score;
                        var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : b.eventSummary[roundIndex - 1].roundSummary.score;
                        return  a_val - b_val;
                    }

                    var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : a.eventSummary[roundIndex - 1].roundSummary.score;
                    var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : b.eventSummary[roundIndex - 1].roundSummary.score;
                    return b_val - a_val;
                };

                sortItemsOnFwy = function(a, b) {
                    if (sortOrder) {
                        var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : a.eventSummary[roundIndex - 1].roundSummary.fir;
                        var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : b.eventSummary[roundIndex - 1].roundSummary.fir;
                        return  a_val - b_val;
                    }

                    var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : a.eventSummary[roundIndex - 1].roundSummary.fir;
                    var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : b.eventSummary[roundIndex - 1].roundSummary.fir;
                    return b_val - a_val;
                };

                sortItemsOnGir = function(a, b) {
                    if (sortOrder) {
                        var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : a.eventSummary[roundIndex - 1].roundSummary.gir;
                        var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : b.eventSummary[roundIndex - 1].roundSummary.gir;
                        return  a_val - b_val;
                    }

                    var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : a.eventSummary[roundIndex - 1].roundSummary.gir;
                    var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : b.eventSummary[roundIndex - 1].roundSummary.gir;
                    return b_val - a_val;
                };

                sortItemsOnPutts = function(a, b) {
                    if (sortOrder) {
                        var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : a.eventSummary[roundIndex - 1].roundSummary.putt;
                        var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 9999 : b.eventSummary[roundIndex - 1].roundSummary.putt;
                        return  a_val - b_val;
                    }

                    var a_val = (a.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : a.eventSummary[roundIndex - 1].roundSummary.putt;
                    var b_val = (b.eventSummary[roundIndex - 1].roundSummary === null) ? 0 : b.eventSummary[roundIndex - 1].roundSummary.putt;
                    return b_val - a_val;
                };


                var sorterFunction;
                switch (opts.mode) {
                    case mode.score.overall:
                    case mode.score.holeByHole:
                        sorterFunction = sortItemsOnRoundScore;
                        break;
                    case mode.fwy.threeColor.holeByHole:
                    case mode.fwy.threeColor.overall:
                    case mode.fwy.twoColor.overall:
                    case mode.fwy.twoColor.holeByHole:
                        sorterFunction = sortItemsOnFwy;
                        break;
                    case mode.gir.holeByHole:
                    case mode.gir.overall:
                        sorterFunction = sortItemsOnGir;
                        break;
                    case mode.putt.holeByHole:
                    case mode.putt.overall:
                        sorterFunction = sortItemsOnPutts;
                        break;
                }
                /** Different sorting functions end **/

                svg.selectAll('.tournaments')
                        .sort(sorterFunction)
                        .transition()
                        .ease('cubic-in-out')
                        .delay(function(datum, index) {
                            return index * 50;
                        })
                        .duration(1000)
                        .attr("transform", function(datum, index) {
                            return "translate(0," + (15 + (23 * index)) + ")";
                        });
                opts.data.sort(sorterFunction);
                svg.selectAll('.sortArrow').each(function() {
                    if (arguments[0] !== selectedRound) {
                        d3.select(this).attr('xlink:href', '/images/sort_neutral.png');
                    } else {
                        switch (_this.attr('data-sort')) {
                            case 'ascending':
                                d3.select(this).attr('xlink:href', '/images/sort_up.png');
                                break;
                            case 'descending':
                                d3.select(this).attr('xlink:href', '/images/sort_down.png');
                                break;
                        }
                    }
                });
                svg.selectAll('.columnSortArrow').attr('xlink:href', '/images/sort_neutral.png');
            },
            /** Function that defines how the sort functionality has to work **/
            sort: function(_this, columnHeader, attributeName) {
                var data_sort = _this.attr('data-sort');
                var svg = opts.svg;
                // reset all other sorted columns..
                svg.selectAll('.roundLables, .columnHeader').each(function() {
                    if (arguments[0] !== columnHeader) {
                        _this.attr('data-sort', null);
                    }
                });
                // helper function to sort the data based on the attribute name.
                sortItemsOnAttribute = function(a, b) {
                    if (sortOrder) {
                        return b.information[attributeName] - a.information[attributeName];
                    }
                    return a.information[attributeName] - b.information[attributeName];
                };
                opts.sortedColumn = columnHeader;
                var sortOrder;
                if (data_sort === null || data_sort === 'descending') {
                    _this.attr('data-sort', 'ascending');
                    sortOrder = true;
                } else {
                    _this.attr('data-sort', 'descending');
                    sortOrder = false;
                }
                opts.sortOrder = sortOrder;
                /** Performing the actual sort of D3 elements **/
                svg.selectAll('.tournaments')
                        .sort(sortItemsOnAttribute)
                        .transition()
                        .ease('cubic-in-out')
                        .delay(function(datum, index) {
                            //incremental delay to give the animation
                            //a staggered feel.
                            return index * 50;
                        })
                        .duration(opts.sortDuration)
                        .attr("transform", function(datum, index) {
                            return "translate(0," + (15 + (23 * index)) + ")";
                        });
                opts.data.sort(sortItemsOnAttribute);
                svg.selectAll('.columnSortArrow').each(function() {
                    if (arguments[0].name !== columnHeader) {
                        d3.select(this).attr('xlink:href', '/images/sort_neutral.png');
                    } else {
                        switch (_this.attr('data-sort')) {
                            case 'ascending':
                                d3.select(this).attr('xlink:href', '/images/sort_up.png');
                                break;
                            case 'descending':
                                d3.select(this).attr('xlink:href', '/images/sort_down.png');
                                break;
                        }
                    }
                });
                svg.selectAll('.sortArrow').attr('xlink:href', '/images/sort_neutral.png');
            },
            onRoundMouseOver: function(svg, o) {
                var round = parseInt(o.charAt(o.length - 1));
                privateMethods.getRoundElements(svg).attr('stroke-opacity', function(o) {
                    var roundCheck = (o.roundSummary) ? (round === o.roundSummary.round) : (round === o.round);
                    var thisOpacity = roundCheck ? 1 : 0.05;
                    if (thisOpacity === 1 &&
                            ((opts.mode === mode.score.holeByHole) || (opts.mode === mode.gir.holeByHole) || (opts.mode === mode.fwy.threeColor.holeByHole) || (opts.mode === mode.fwy.twoColor.holeByHole) || (opts.mode === mode.putt.holeByHole))) {
                        var par = (o.roundSummary) ? undefined : o.par;
                        if (par) {
                            switch (par) {
                                case 3:
                                    thisOpacity = (opts.par3) ? 1 : 0.05;
                                    break;
                                case 4:
                                    thisOpacity = (opts.par4) ? 1 : 0.05;
                                    break;
                                case 5:
                                    thisOpacity = (opts.par5) ? 1 : 0.05;
                                    break;
                            }
                        }
                    }
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });
            },
            onRoundMouseOut: function(svg) {
                privateMethods.getRoundElements(svg).attr('stroke-opacity', 1).attr('fill-opacity', 1);
                publicMethods.onParChanged(opts.par3, opts.par4, opts.par5);
            },
            getRoundElements: function(svg) {
                var roundElement;
                switch (opts.mode) {
                    case mode.score.overall:
                    case mode.fwy.threeColor.overall:
                    case mode.fwy.twoColor.overall:
                    case mode.gir.overall:
                    case mode.putt.overall:
                        roundElement = svg.selectAll('.roundSummary');
                        break;
                    case mode.score.holeByHole:
                    case mode.fwy.threeColor.holeByHole:
                    case mode.fwy.twoColor.holeByHole:
                    case mode.gir.holeByHole:
                    case mode.putt.holeByHole:
                        roundElement = svg.selectAll('.holeSummary, .holeSummaryR, .holeSummaryL, .roundBorder');
                        break;
                }
                return roundElement;
            },
            loadColors: function() {

            },
            drawViz: function() {
                opts.scoreOverAllKeyData = [];
                opts.scoreHoleByHoleKeyData = [];
                opts.fwy2OverallKeyData = [];
                opts.fwy2HoleByHoleKeyData = [0, 0];
                opts.girOverallKeyData = [];
                opts.girHoleByHoleKeyData = [0, 0];
                opts.fwy3HoleByHoleKeyData = {left: 0, right: 0, hit: 0, unknown: 0};
                opts.puttOverAllKeyData = [];
                opts.puttHoleByHoleKeyData = [0, 0, 0, 0, 0];
                opts.totalRounds = 0;
                opts.totalHoles = 0;

                for (var i = 22; i <= 36; i++) {
                    opts.puttOverAllKeyData[i] = 0;
                }

                for (var i = 7; i <= 18; i++) {
                    opts.girOverallKeyData[i] = 0;
                }

                for (var i = -8; i <= 8; i++) {
                    opts.scoreOverAllKeyData[i] = 0;
                    opts.scoreHoleByHoleKeyData[i] = 0;
                    opts.fwy2OverallKeyData[i + 8] = 0;
                    opts.fwy2OverallKeyData[i + 16] = 0;
                }

                var svg = opts.svg;
                opts.dimension.nextTournamentLocation = opts.dimension.roundHeight + opts.dimension.tournamentPadding;
                svg.selectAll(".tournaments").data(opts.data).enter()
                        .append("g")
                        .attr("class", "tournaments")
                        .attr("transform", function(datum, index) {
                            return "translate(0," + ((index * opts.dimension.nextTournamentLocation) + opts.dimension.topMargin) + ")";
                        })
                        .each(function(tournamentData, tournamentIndex) {
                            var tournament = d3.select(this);
                            privateMethods.addTournamentStats(tournament, arguments);

                            tournament.selectAll('.round').data(tournamentData.eventSummary).enter()
                                    .append("g")
                                    .attr("class", "round")
                                    .attr("transform", function(datum, index) {
                                        var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                                        return "translate(" + x + "," + opts.dimension.roundHeight + ")";
                                    })
                                    .each(function(roundData, roundIndex) {
                                        if (roundData.holeDetails === undefined || roundData.holeDetails === null) {
                                            return false;
                                        }
                                        var round = d3.select(this);
                                        switch (opts.mode) {
                                            case mode.score.overall:
                                                privateMethods.drawSummary(round, [roundData.roundSummary], function(datum) {
                                                    if (datum !== null) {
                                                        var diff = datum.score - datum.par;
                                                        var color = privateMethods.getSummaryColor(diff);
                                                        opts.scoreOverAllKeyData[diff] = opts.scoreOverAllKeyData[diff] + 1;
                                                        opts.totalRounds = opts.totalRounds + 1;
                                                        return "fill:" + color + "; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;";
                                                    }
                                                });
                                                break;
                                            case mode.score.holeByHole:
                                                privateMethods.drawHole(round, [roundData.roundSummary], roundData.holeDetails, tournamentIndex, function(datum) {
                                                    var diff = datum.score - datum.par;
                                                    opts.scoreHoleByHoleKeyData[diff] = opts.scoreHoleByHoleKeyData[diff] + 1;
                                                    opts.totalHoles = opts.totalHoles + 1;
                                                    var color = (diff === 0) ? opts.color.parColorSwatch : ((diff < 0) ? privateMethods.birdieColor(diff) : privateMethods.bogeyColor(diff));
                                                    return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                            case mode.fwy.twoColor.overall:
                                                privateMethods.drawSummary(round, [arguments[0].roundSummary], function(datum) {
                                                    var color = privateMethods.getFwyTwoColorSummaryColor(datum.fir);
                                                    opts.fwy2OverallKeyData[datum.fir] += 1;
                                                    opts.totalRounds = opts.totalRounds + 1;
                                                    return "fill:" + color + "; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                            case mode.fwy.twoColor.holeByHole:
                                                privateMethods.drawHole(round, [roundData.roundSummary], roundData.holeDetails, tournamentIndex, function(datum, index) {
                                                    var color = (datum.fir === 0) ? opts.color.parColorSwatch : privateMethods.getFwyTwoColorSummaryColor(11);
                                                    opts.fwy2HoleByHoleKeyData[datum.fir] += 1;
                                                    opts.totalHoles += 1;
                                                    return "fill:" + color + ";";
                                                });
                                                break;
                                            case mode.gir.overall:
                                                privateMethods.drawSummary(round, [arguments[0].roundSummary], function(datum) {
                                                    var color = privateMethods.getGirSummaryColor(datum.gir);
                                                    opts.girOverallKeyData[datum.gir] += 1;
                                                    opts.totalRounds += 1;
                                                    return "fill:" + color + "; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                            case mode.gir.holeByHole:
                                                privateMethods.drawHole(round, [roundData.roundSummary], roundData.holeDetails, tournamentIndex, function(datum, index) {
                                                    var color = (datum.gir === 0) ? opts.color.parColorSwatch : privateMethods.getGirSummaryColor(16);
                                                    opts.girHoleByHoleKeyData[datum.gir] += 1;
                                                    opts.totalHoles += 1;
                                                    return "fill:" + color + ";";
                                                });
                                                break;
                                            case mode.fwy.threeColor.overall:
                                                privateMethods.drawSummary(round, [roundData.roundSummary], function(datum, index) {
                                                    var color;
                                                    if (datum.rr === datum.lr) {
                                                        color = opts.fwy3OverallColorSwatch[Math.min(datum.fir, 14)];
                                                    } else {
                                                        if (datum.rr > datum.lr) {
                                                            color = opts.fwy3RightOverallColorSwatch[Math.min(datum.rr, 14)];
                                                        } else {
                                                            color = opts.fwy3LeftOverallColorSwatch[Math.min(datum.lr, 14)];
                                                        }
                                                    }
                                                    return "fill:" + color + "; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                            case mode.fwy.threeColor.holeByHole:
                                                privateMethods.drawHole(round, [roundData.roundSummary], roundData.holeDetails, tournamentIndex, function(datum, index) {
                                                    var color;
                                                    if (datum.fir === 0) {
                                                        switch (datum.rough) {
                                                            case "LR":
                                                                color = opts.fwy3LeftOverallColorSwatch[2];
                                                                opts.fwy3HoleByHoleKeyData.left += 1;
                                                                break;
                                                            case "RR":
                                                                color = opts.fwy3RightOverallColorSwatch[2];
                                                                opts.fwy3HoleByHoleKeyData.right += 1;
                                                                break;
                                                            default:
                                                                color = "#bcbddc";
                                                                opts.fwy3HoleByHoleKeyData.unknown += 1;
                                                        }
                                                    } else {
                                                        color = opts.fwy3OverallColorSwatch[14];
                                                        opts.fwy3HoleByHoleKeyData.hit += 1;
                                                    }
                                                    opts.totalHoles += 1;
                                                    return "fill:" + color + ";";
                                                });
                                                break;
                                            case mode.putt.overall:
                                                privateMethods.drawSummary(round, [roundData.roundSummary], function(datum, index) {
                                                    opts.totalRounds += 1;
                                                    opts.puttOverAllKeyData[datum.putt] += 1;
                                                    var diff = datum.putt - 29;
                                                    var color = privateMethods.getPuttSummaryColor(diff);
                                                    return "fill:" + color + "; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                            case mode.putt.holeByHole:
                                                privateMethods.drawHole(round, [roundData.roundSummary], roundData.holeDetails, tournamentIndex, function(datum) {
                                                    opts.totalHoles += 1;
                                                    opts.puttHoleByHoleKeyData[datum.putts] += 1;
                                                    var diff = datum.putts - 2;
                                                    var color = (diff === 0) ? opts.color.parColorSwatch : ((diff < 0) ? privateMethods.birdieColor(diff) : privateMethods.bogeyColor(diff));
                                                    return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                                });
                                                break;
                                        }
                                    });
                        });
            },
            drawHole: function(round, roundSummary, holeDetails, tournamentIndex, styleFunction) {
                var oneToSeventeenHoles = [];
                round.append('g').attr("class", "showHoleScores")
                        .data(roundSummary)
                        .append('rect')
                        .attr("class", 'roundBorder')
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", opts.dimension.roundWidth)
                        .attr("height", opts.dimension.roundHeight)
                        .attr("style", "fill:#FFFFFF; stroke: #c0c0c0; stroke-width: 0.25px; vector-effect: non-scaling-stroke;");
                $.each(holeDetails, function(index, datum) {
                    if (index === 0) {
                        round.select('.showHoleScores').selectAll('.holeSummaryL').data([datum]).enter()
                                .append("path")
                                .attr("class", "holeSummaryL showTooltip")
                                .attr("d", privateMethods.leftRoundedRect(0, 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5))
                                .attr("style", styleFunction)
                                .attr('data-toggle', 'tooltip')
                                .attr('data-placement', 'bottom')
                                .attr('data-title', function(datum) {
                                    return privateMethods.getHoleTooltipContent(datum, 0);
                                });
                    } else if (index === 17) {
                        round.select('.showHoleScores').selectAll('.holeSummaryR').data([datum]).enter()
                                .append("path")
                                .attr("class", "holeSummaryR showTooltip")
                                .attr("d", privateMethods.rightRoundedRect(17 * (opts.dimension.roundWidth / 18), 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5))
                                .attr("style", styleFunction)
                                .attr('data-toggle', 'tooltip')
                                .attr('data-placement', 'top')
                                .attr('data-title', function(datum) {
                                    return privateMethods.getHoleTooltipContent(datum, 17);
                                });
                    } else {
                        datum.index = index;
                        oneToSeventeenHoles.push(datum);
                    }
                });
                round.select('.showHoleScores').selectAll('.holeSummary')
                        .data(oneToSeventeenHoles).enter()
                        .append("rect")
                        .attr("class", "holeSummary showTooltip")
                        .attr("x", function(datum) {
                            return (datum.index) * (opts.dimension.roundWidth / 18);
                        })
                        .attr("y", 0)
                        .attr("width", (opts.dimension.roundWidth / 18))
                        .attr("height", opts.dimension.roundHeight)
                        .attr("style", styleFunction)
                        .attr('data-toggle', 'tooltip')
                        .attr('data-placement', function() {
                            return (tournamentIndex > (opts.data.length / 2)) ? 'top' : 'bottom';
                        })
                        .attr('data-title', function(datum, index) {
                            return privateMethods.getHoleTooltipContent(datum, index+1);
                        });
            },
            getHoleTooltipContent: function(datum, index) {
                var tooltipTemplate = "<li class='round-details'> {{val}} <span class='round-label'> {{attr}} </span> </li>";
                var imageTemplate = "<li class='round-details'> <span class='glyphicon glyphicon-{{class}}'></span> <span class='round-label'> {{attr}} </span> </li>";
                var tooltipText = "<ul class='list-unstyled customUl'>" + tooltipTemplate.replace('{{val}}', privateMethods.padZero(index + 1)).replace('{{attr}}', 'Hole');
                tooltipText += tooltipTemplate.replace('{{val}}', privateMethods.padZero(datum.score)).replace('{{attr}}', 'Score');
                tooltipText += imageTemplate.replace('{{attr}}', 'FWY').replace('{{class}}', (datum.par === 1) ? 'ok' : 'remove');
                tooltipText += imageTemplate.replace('{{attr}}', 'GIR').replace('{{class}}', (datum.gir === 1) ? 'ok' : 'remove');
                tooltipText += tooltipTemplate.replace('{{val}}', privateMethods.padZero(datum.putts)).replace('{{attr}}', 'Putts');
                return tooltipText + "</ul>";
            },
            // Returns path data for a rectangle with rounded right corners.
            // The top-left corner is ⟨x,y⟩.
            rightRoundedRect: function(x, y, width, height, radius) {
                return privateMethods.rounded_rect(x, y, width, height, radius, false, true, false, true);
            },
            leftRoundedRect: function(x, y, width, height, radius) {
                return privateMethods.rounded_rect(x, y, width, height, radius, true, false, true, false);
            },
            rounded_rect: function(x, y, w, h, r, tl, tr, bl, br) {
                var retval;
                retval = "M" + (x + r) + "," + y;
                retval += "h" + (w - 2 * r);
                if (tr) {
                    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r;
                }
                else {
                    retval += "h" + r;
                    retval += "v" + r;
                }
                retval += "v" + (h - 2 * r);
                if (br) {
                    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r;
                }
                else {
                    retval += "v" + r;
                    retval += "h" + -r;
                }
                retval += "h" + (2 * r - w);
                if (bl) {
                    retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r;
                }
                else {
                    retval += "h" + -r;
                    retval += "v" + -r;
                }
                retval += "v" + (2 * r - h);
                if (tl) {
                    retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r;
                }
                else {
                    retval += "v" + -r;
                    retval += "h" + r;
                }
                retval += "z";
                return retval;
            },
            drawSummary: function(round, roundSummary, styleFunction) {
                round.selectAll('.roundSummary')
                        .data(roundSummary).enter()
                        .append("rect")
                        .attr("rx", 5)
                        .attr("ry", 5)
                        .attr("class", "roundSummary showScores")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", opts.dimension.roundWidth)
                        .attr("height", opts.dimension.roundHeight)
                        .attr("style", styleFunction)
                        .attr("data-title", function(datum) {
                            var tooltipTemplate = "<div><span class='round-details'>{{val}} <span class='round-label'> {{attr}}</span></span></div>";
                            var tooltipText = tooltipTemplate.replace('{{val}}', datum.score).replace('{{attr}}', 'SCORE');
                            tooltipText += tooltipTemplate.replace('{{val}}', privateMethods.padZero(datum.fir)).replace('{{attr}}', 'FWY');
                            tooltipText += tooltipTemplate.replace('{{val}}', privateMethods.padZero(datum.gir)).replace('{{attr}}', 'GIR');
                            tooltipText += tooltipTemplate.replace('{{val}}', datum.putt).replace('{{attr}}', 'PUTTS');
                            return tooltipText;
                        })
                        .attr("data-toggle", "tooltip");
            },
            padZero: function(val) {
                return (val < 10) ? "0" + val : val;
            },
            getSummaryColor: function(diff) {
                if (diff < 0) {
                    return opts.color.negativeColor[Math.abs(Math.max(diff, -8)) - 1];
                } else if (diff > 0) {
                    return opts.color.positiveColor[Math.abs(Math.min(diff, 8)) - 1];
                } else if (diff === 0) {
                    return opts.color.parColorSwatch;
                }
            },
            getPuttSummaryColor: function(diff) {
                if (diff < 0) {
                    return opts.color.positiveColor[Math.abs(Math.max(diff, -7))];
                } else if (diff > 0) {
                    return opts.color.negativeColor[Math.abs(Math.min(diff, 7))];
                } else if (diff === 0) {
                    return opts.color.parColorSwatch;
                }
            },
            getFwyTwoColorSummaryColor: function(fir) {
                if (fir === 8) {
                    return opts.color.parColorSwatch;
                } else if (fir < 8) {
                    return opts.color.fwyNegativeColor[7 - fir];
                } else {
                    return opts.color.fwyPositiveColor[Math.min(fir - 9, 5)];
                }
            },
            getGirSummaryColor: function(gir) {
                if (gir === 12) {
                    return opts.color.parColorSwatch;
                } else if (gir < 12) {
                    return opts.color.fwyNegativeColor[Math.min(11 - gir, 5)];
                } else {
                    return opts.color.fwyPositiveColor[Math.min(gir - 13, 5)];
                }
            },
            addTournamentStats: function(tournament, arguments) {
                tournament.selectAll('.tournamentName').data([arguments[0]]).enter()
                        .append("g")
                        .attr("class", "tournamentName")
                        .attr("transform", "translate(170,25)")
                        .each(function() {
                            var name = d3.select(this);
                            name.append("text")
                                    .attr("x", "0")
                                    .attr("y", "0")
                                    .text(arguments[0].information.name)
                                    .attr("text-anchor", "end")
                                    .attr("style", "fill: #000000;")
                                    .attr("font-size", "10px");
                            name.append("g")
                                    .attr("class", "tournamentDetails")
                                    .attr("visibility", "hidden")
                                    .each(function() {
                                        var tournamentDetails = d3.select(this);
                                        tournamentDetails.append("text")
                                                .attr("x", 0)
                                                .attr("y", 13)
                                                .text(arguments[0].information.place)
                                                .attr("text-anchor", "end")
                                                .attr("style", "fill:" + opts.color.placeFontColor + ";")
                                                .attr("font-size", "10px");
                                        tournamentDetails.append("image")
                                                .attr("width", 30)
                                                .attr("height", 30)
                                                .attr("xlink:href", "/images/tournaments/1.png")
                                                .attr("x", 0)
                                                .attr("y", -15);
                                    });
                        });
                tournament.selectAll(".tournamentStat").data([arguments[0].information]).enter()
                        .append("g")
                        .attr("class", "tournamentStat")
                        .attr("transform", "translate(714, 25)")
                        .each(function() {
                            var tournamentStat = d3.select(this);
                            tournamentStat.append("text")
                                    .text(arguments[0].finishPositionText)
                                    .attr("x", "30")
                                    .attr("y", "0")
                                    .attr("text-anchor", "middle")
                                    .attr("style", "fill: #000000;")
                                    .attr("font-size", "10px");
                            tournamentStat.append("text")
                                    .text(arguments[0].totalScore)
                                    .attr("x", "130")
                                    .attr("y", "0")
                                    .attr("text-anchor", "middle")
                                    .attr("style", "fill: #000000;")
                                    .attr("font-size", "10px");
                            var parScore = arguments[0].underPar;
                            if (parScore > 0) {
                                parScore = "+" + parScore;
                            } else if (parScore === 0) {
                                parScore = "E";
                            }

                            tournamentStat.append("text")
                                    .text(parScore)
                                    .attr("x", "85")
                                    .attr("y", "0")
                                    .attr("text-anchor", "middle")
                                    .attr("style", "fill: #000000;")
                                    .attr("font-size", "10px");
                        });
            },
            addInteractions: function() {
                var svg = opts.svg;
                svg.selectAll('.sortArrow').on("click", function(roundLabel) {
                    svg.selectAll('.roundLables').each(function(datum) {
                        if (datum === roundLabel) {
                            $(this).d3Click();
                            return false;
                        }
                    });
                });

                svg.selectAll('.columnSortArrow').on("click", function(columnLabel) {
                    svg.selectAll('.columnHeader').each(function(datum) {
                        if (columnLabel.name === datum.name) {
                            $(this).d3Click();
                            return false;
                        }
                    });
                });

                svg.selectAll('.holeSummary, .holeSummaryL, .holeSummaryR').on("mouseover", function() {
                    if (parseInt(d3.select(this).attr('fill-opacity')) === 1) {
                        d3.select(this).attr('stroke-width', '0.25px').attr('stroke', "#000000");
                    }
                }).on("mouseout", function() {
                    d3.select(this).attr('stroke', null);
                });

                switch (opts.mode) {
                    case mode.score.overall:
                    case mode.fwy.threeColor.overall:
                    case mode.fwy.twoColor.overall:
                    case mode.gir.overall:
                    case mode.putt.overall:
                        var overallTournament;
                        /** Hover interactions on tournamentName **/
                        svg.selectAll('.tournamentName').on("mouseover", function(o) {
                            overallTournament = setTimeout(function() {
                                overallTournament = null;
                                privateMethods.tournamentMouseoverOnOverallMode(svg, o);
                            }, opts.mouseoverActivationTime);
                        }).on("mouseout", function(o) {
                            if (overallTournament) {
                                clearTimeout(overallTournament);
                            } else {
                                privateMethods.tournamentMouseoutOnOverallMode(svg);
                            }
                        });
                        var roundTimeout;
                        /** Interactions showing round details on demand **/
                        svg.selectAll('.showScores').on("mouseover", function(o) {
                            var self = this;
                            if (opts.fadeOtherRoundsOnHover) {
                                roundTimeout = setTimeout(function() {
                                    roundTimeout = null;
                                    svg.selectAll('.roundSummary').each(function(roundStat) {
                                        var thisOpacity = ((o.round === roundStat.round) && (o.name === roundStat.name)) ? 1 : 0.05;
                                        d3.select(this).attr('fill-opacity', thisOpacity).attr('stroke-opacity', thisOpacity);
                                    });
                                    $('.roundLables').attr('class', 'roundLables fade-round');
                                    $('.tournamentStat, .columnHeader').attr('fill-opacity', 0.05);
                                    $('.sortArrow, .columnSortArrow').attr('opacity', 0.05);
                                }, opts.mouseoverActivationTime);
                            }
                        }).on("mouseout", function(o) {
                            if (opts.fadeOtherRoundsOnHover) {
                                if (roundTimeout) {
                                    clearTimeout(roundTimeout);
                                } else {
                                    svg.selectAll('.roundSummary').attr('fill-opacity', 1).attr('stroke-opacity', 1);
                                    $('.roundLables').attr('class', 'roundLables');
                                    $('.tournamentStat, .columnHeader').attr('fill-opacity', 1);
                                    $('.sortArrow, .columnSortArrow').attr('opacity', 1);
                                }
                            }
                        });
                        $('.showScores').tooltip({
                            container: 'body',
                            placement: 'right',
                            delay: {
                                show: 500,
                                hide: 100
                            },
                            html: true,
                            trigger: 'click'
                        });
                        break;
                    case mode.score.holeByHole:
                    case mode.fwy.threeColor.holeByHole:
                    case mode.fwy.twoColor.holeByHole:
                    case mode.gir.holeByHole:
                    case mode.putt.holeByHole:
                        var holeByHoleTournament;
                        /** Hover interactions on tournamentName **/
                        svg.selectAll('.tournamentName').on("mouseover", function(o) {
                            holeByHoleTournament = setTimeout(function() {
                                holeByHoleTournament = null;
                                privateMethods.tournamentMouseoverOnHoleByHoleMode(svg, o);
                            }, opts.mouseoverActivationTime);
                        }).on("mouseout", function(o) {
                            if (holeByHoleTournament) {
                                clearTimeout(holeByHoleTournament);
                            } else {
                                privateMethods.tournamentMouseoutOnHoleByHole(svg, o);
                            }
                        });
                        var roundTimeout;
                        svg.selectAll('.showHoleScores').on("mouseover", function(o) {
                            var self = this;
                            if (opts.fadeOtherRoundsOnHover) {
                                roundTimeout = setTimeout(function() {
                                    roundTimeout = null;
                                    svg.selectAll('.showHoleScores').each(function(roundStat) {
                                        var thisOpacity = ((o.roundSummary.round === roundStat.roundSummary.round) && (o.roundSummary.name === roundStat.roundSummary.name)) ? 1 : 0.05;
                                        d3.select(this).attr('fill-opacity', thisOpacity).attr('stroke-opacity', thisOpacity);
                                    });
                                    $('.roundLables').attr('class', 'roundLables fade-round');
                                    $('.tournamentStat, .columnHeader').attr('fill-opacity', 0.05);
                                    $('.sortArrow, .columnSortArrow').attr('opacity', 0.05);
                                }, opts.mouseoverActivationTime);
                            }
                        }).on("mouseout", function() {
                            if (opts.fadeOtherRoundsOnHover) {
                                if (roundTimeout) {
                                    clearTimeout(roundTimeout);
                                } else {
                                    svg.selectAll('.showHoleScores').attr('fill-opacity', 1).attr('stroke-opacity', 1);
                                    $('.roundLables').attr('class', 'roundLables');
                                    $('.tournamentStat, .columnHeader').attr('fill-opacity', 1);
                                    $('.sortArrow, .columnSortArrow').attr('opacity', 1);
                                }
                            }
                        });
                        $('.showTooltip').tooltip({
                            container: 'body',
                            delay: {
                                show: 500,
                                hide: 100
                            },
                            html: true
                        });
                        break;
                }
            },
            tournamentMouseoverOnOverallMode: function(svg, o) {
                $('.sortArrow, .columnSortArrow').attr('opacity', 0.05);
                var place = o.information.name;
                svg.selectAll('.tournaments').each(function(datum) {
                    var _this = d3.select(this);
                    if (datum.information.name === place) {
                        _this.selectAll('.roundSummary')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('height', opts.dimension.expandedRoundHeight);
                        var imageX = Math.abs($(this).find('.tournamentName')[0].getBBox().width) + 10;
                        _this.select('image').attr('x', -imageX);
                        $(this).find('.tournamentDetails').css({visibility: "visible"});
                    } else {
                        _this.select('.tournamentStat').attr('fill-opacity', 0.05);
                        $(this).find('.tournamentName').css({opacity: 0.05});
                        _this.selectAll('.roundSummary')
                                .attr('stroke-opacity', 0.05)
                                .attr('fill-opacity', 0.05);
                    }
                });
            },
            tournamentMouseoutOnOverallMode: function(svg) {
                $('.sortArrow, .columnSortArrow').attr('opacity', '1');
                svg.selectAll('.tournaments').each(function() {
                    var _this = d3.select(this);
                    _this.selectAll('.roundSummary')
                            .transition()
                            .ease('cubic-in-out')
                            .attr('height', opts.dimension.roundHeight);
                    _this.select('.tournamentStat').attr('fill-opacity', 1);
                    _this.selectAll('.roundSummary')
                            .attr('stroke-opacity', 1)
                            .attr('fill-opacity', 1);
                    $(this).find('.tournamentDetails').css({visibility: "hidden"});
                    $(this).find('.tournamentName').css({opacity: 1});
                });
            },
            tournamentMouseoverOnHoleByHoleMode: function(svg, o) {
                $('.sortArrow, .columnSortArrow').attr('opacity', 0.05);
                var place = o.information.name;
                svg.selectAll('.tournaments').each(function(datum) {
                    var _this = d3.select(this);
                    if (datum.information.name === place) {
                        var imageX = Math.abs($(this).find('.tournamentName')[0].getBBox().width) + 10;
                        _this.select('image').attr('x', -imageX);
                        $(this).find('.tournamentDetails').css({visibility: "visible"});
                        _this.selectAll('.holeSummary, .roundBorder')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('height', opts.dimension.expandedRoundHeight);
                        _this.selectAll('.holeSummaryL')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('d', privateMethods.leftRoundedRect(0, 0, (opts.dimension.roundWidth / 18), opts.dimension.expandedRoundHeight, 5));
                        _this.selectAll('.holeSummaryR')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('d', privateMethods.rightRoundedRect(17 * (opts.dimension.roundWidth / 18), 0, (opts.dimension.roundWidth / 18), opts.dimension.expandedRoundHeight, 5));
                    } else {
                        _this.select('.tournamentStat').attr('fill-opacity', 0.05);
                        $(this).find('.tournamentName').css({opacity: 0.05});
                        _this.selectAll('.roundBorder, .holeSummary, .holeSummaryL, .holeSummaryR').attr('stroke-opacity', 0.05).attr('fill-opacity', 0.05);
                    }
                });
            },
            tournamentMouseoutOnHoleByHole: function(svg, o) {
                $('.sortArrow, .columnSortArrow').attr('opacity', 1);
                var name = o.information.name;
                svg.selectAll('.tournaments').each(function(datum) {
                    var _this = d3.select(this);
                    $(this).find('.tournamentDetails').css({visibility: "hidden"});
                    $(this).find('.tournamentName').css({opacity: 1});
                    _this.select('.tournamentStat').attr('fill-opacity', 1);
                    if (datum.information.name === name) {
                        _this.selectAll('.holeSummary, .roundBorder')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('height', opts.dimension.roundHeight);
                        _this.selectAll('.holeSummaryL')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('d', privateMethods.leftRoundedRect(0, 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5));
                        _this.selectAll('.holeSummaryR')
                                .transition()
                                .ease('cubic-in-out')
                                .attr('d', privateMethods.rightRoundedRect(17 * (opts.dimension.roundWidth / 18), 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5));
                    } else {
                        _this.selectAll('.roundBorder, .holeSummary, .holeSummaryL, .holeSummaryR').attr('stroke-opacity', 1).attr('fill-opacity', 1);
                    }
                });
                publicMethods.onParChanged(opts.par3, opts.par4, opts.par5);
            },
            renderKey: function() {
                var key = d3.select(opts.keySelector).append("g");
                switch (opts.mode) {
                    case mode.score.overall:
                        privateMethods.renderOverallScoreKey(key);
                        break;
                    case mode.fwy.twoColor.overall:
                        privateMethods.renderOverallFwyTwoColorKey(key);
                        break;
                    case mode.fwy.threeColor.overall:
                        privateMethods.renderOverallFwyThreeColorKey(key);
                        break;
                    case mode.gir.overall:
                        privateMethods.renderOverallGirColorKey(key);
                        break;
                    case mode.putt.overall:
                        privateMethods.renderOverallPuttsKey(key);
                        break;
                    case mode.score.holeByHole:
                        privateMethods.renderHoleByHoleScoreKey(key);
                        break;
                    case mode.putt.holeByHole:
                        privateMethods.renderHoleByHolePuttsKey(key);
                        break;
                    case mode.fwy.twoColor.holeByHole:
                        privateMethods.renderHoleByHoleFwyTwoColorKey(key);
                        break;
                    case mode.fwy.threeColor.holeByHole:
                        privateMethods.renderHoleByHoleFwyThreeColorKey(key);
                        break;
                    case mode.gir.holeByHole:
                        privateMethods.renderHoleByHoleGirKey(key);
                        break;
                }
            },
            renderOverallPuttsKey: function(key) {
                var _data = [];
                var keyObject;
                for (var putts = 22; putts <= 36; putts++) {
                    keyObject = {
                        color: privateMethods.getPuttSummaryColor(putts - 29),
                        value: putts
                    };
                    if (opts.totalRounds !== 0) {
                        keyObject.percentage = Math.abs(Math.floor(((opts.puttOverAllKeyData[putts] / opts.totalRounds) * 100) + 0.5));
                    }
                    _data.push(keyObject);
                }

                key.attr("transform", "translate(0,35)")
                        .each(function() {
                            var keyG = d3.select(this);

                            var width = 25;
                            var halfWidth = width / 2;

                            keyG.append("text").text("Total Putts")
                                    .attr("font-size", "12px")
                                    .attr("text-anchor", "middle")
                                    .attr("x", width * 8 + halfWidth)
                                    .attr("y", -10)
                                    .attr("style", "fill: #000000");

                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", width)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = (o.putt === parseInt(datum.value)) ? 1 : 0.05;
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });

                            keyG.selectAll('.key-text').data(_data).enter()
                                    .append('text')
                                    .attr("class", 'key-text')
                                    .text(function(datum) {
                                        return datum.value;
                                    })
                                    .attr("x", function(datum, index) {
                                        return (index) * width + halfWidth;
                                    })
                                    .attr("y", 15)
                                    .attr("text-anchor", "middle")
                                    .attr("font-weight", "bold")
                                    .attr("font-size", "10px")
                                    .attr("style", "fill: #FFFFFF");

                            if (_data[0].percentage !== undefined) {
                                keyG.selectAll('.percentage-text').data(_data).enter()
                                        .append('text')
                                        .attr('class', 'percentage-text')
                                        .text(function(datum) {
                                            return datum.percentage + "%";
                                        })
                                        .attr("x", function(datum, index) {
                                            return (index * width) + (width / 2);
                                        })
                                        .attr("y", 40)
                                        .attr("text-anchor", "middle")
                                        .attr("font-size", "10px");
                            }
                        });
            },
            renderOverallGirColorKey: function(key) {
                var _data = [];
                var keyObject;
                for (var gir = 7; gir <= 18; gir++) {
                    keyObject = {
                        color: privateMethods.getGirSummaryColor(gir),
                        value: gir
                    };
                    if (opts.totalRounds !== 0) {
                        keyObject.percentage = Math.abs(Math.floor(((opts.girOverallKeyData[gir] / opts.totalRounds) * 100) + 0.5));
                    }
                    _data.push(keyObject);
                }

                key.attr("transform", "translate(0,35)")
                        .each(function() {
                            var keyG = d3.select(this);

                            var width = 25;
                            var halfWidth = width / 2;

                            keyG.append("text").text("Total Greens in Regulation Hit")
                                    .attr("font-size", "12px")
                                    .attr("text-anchor", "middle")
                                    .attr("x", width * 8 + halfWidth)
                                    .attr("y", -10)
                                    .attr("style", "fill: #000000");

                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", width)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = (o.gir === parseInt(datum.value)) ? 1 : 0.05;
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });

                            keyG.selectAll('.key-text').data(_data).enter()
                                    .append('text')
                                    .attr("class", 'key-text')
                                    .text(function(datum) {
                                        return datum.value;
                                    })
                                    .attr("x", function(datum, index) {
                                        return (index) * width + halfWidth;
                                    })
                                    .attr("y", 15)
                                    .attr("text-anchor", "middle")
                                    .attr("font-weight", "bold")
                                    .attr("font-size", "10px")
                                    .attr("style", "fill: #FFFFFF");

                            if (_data[0].percentage !== undefined) {
                                keyG.selectAll('.percentage-text').data(_data).enter()
                                        .append('text')
                                        .attr('class', 'percentage-text')
                                        .text(function(datum) {
                                            return datum.percentage + "%";
                                        })
                                        .attr("x", function(datum, index) {
                                            return (index * width) + (width / 2);
                                        })
                                        .attr("y", 40)
                                        .attr("text-anchor", "middle")
                                        .attr("font-size", "10px");
                            }
                        });
            },
            renderOverallFwyThreeColorKey: function(key) {
                var _data = [], _vertical_data = [];
                for (var fir = 14; fir >= 1; fir--) {
                    _data.push({
                        color: opts.fwy3LeftOverallColorSwatch[fir],
                        value: fir, direction: "left"
                    });
                }
                _data.push({
                    color: opts.fwy3OverallColorSwatch[1],
                    value: 1, direction: "center"
                });
                for (var fir = 1; fir <= 14; fir++) {
                    _data.push({
                        color: opts.fwy3RightOverallColorSwatch[fir],
                        value: fir, direction: "right"
                    });
                }
                for (var fir = 2; fir <= 14; fir++) {
                    _vertical_data.push({
                        color: opts.fwy3OverallColorSwatch[fir],
                        value: fir, direction: "center"
                    });
                }

                key.attr("transform", "translate(0, 65)")
                        .each(function() {
                            var keyG = d3.select(this);
                            var width = 12.5;
                            var halfWidth = width / 2;
                            var quarterWidth = width / 3;
                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", halfWidth)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum, index) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = 0.05;
                                            if (datum.direction === "left" && o.lr > o.rr) {
                                                if ((o.lr - o.rr) === datum.value) {
                                                    thisOpacity = 1;
                                                }
                                            }
                                            if (datum.direction === "right" && o.rr > o.lr) {
                                                if ((o.rr - o.lr) === datum.value) {
                                                    thisOpacity = 1;
                                                }
                                            }
                                            if (datum.direction === "center" && o.rr === o.lr) {
                                                if (o.fir === datum.value) {
                                                    thisOpacity = 1;
                                                }
                                            }
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });


                            keyG.selectAll('.vertical-key-item').data(_vertical_data).enter()
                                    .append('rect')
                                    .attr("class", 'key-item')
                                    .attr("x", 14 * width)
                                    .attr("y", function(datum, index) {
                                        return quarterWidth - ((index + 1) * quarterWidth);
                                    })
                                    .attr("width", width)
                                    .attr("height", quarterWidth)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum, index) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = 0.05;
                                            if (datum.direction === "center" && o.rr === o.lr) {
                                                if (o.fir === datum.value) {
                                                    thisOpacity = 1;
                                                }
                                            }
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });
                        });
            },
            renderOverallFwyTwoColorKey: function(key) {
                var _data = [];
                var keyObject;
                for (var fir = 2; fir <= 14; fir++) {
                    keyObject = {
                        color: privateMethods.getFwyTwoColorSummaryColor(fir),
                        value: fir
                    };
                    if (opts.totalRounds !== 0) {
                        keyObject.percentage = Math.abs(Math.floor(((opts.fwy2OverallKeyData[fir] / opts.totalRounds) * 100) + 0.5));
                    }
                    _data.push(keyObject);
                }

                key.attr("transform", "translate(0,35)")
                        .each(function() {
                            var keyG = d3.select(this);

                            var width = 25;
                            var halfWidth = width / 2;

                            keyG.append("text").text("Total Fairways Hit")
                                    .attr("font-size", "12px")
                                    .attr("text-anchor", "middle")
                                    .attr("x", width * 8 + halfWidth)
                                    .attr("y", -10)
                                    .attr("style", "fill: #000000");

                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", width)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = (o.fir === parseInt(datum.value)) ? 1 : 0.05;
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });

                            keyG.selectAll('.key-text').data(_data).enter()
                                    .append('text')
                                    .attr("class", 'key-text')
                                    .text(function(datum) {
                                        return datum.value;
                                    })
                                    .attr("x", function(datum, index) {
                                        return (index) * width + halfWidth;
                                    })
                                    .attr("y", 15)
                                    .attr("text-anchor", "middle")
                                    .attr("font-weight", "bold")
                                    .attr("font-size", "10px")
                                    .attr("style", "fill: #FFFFFF");

                            if (_data[0].percentage !== undefined) {
                                keyG.selectAll('.percentage-text').data(_data).enter()
                                        .append('text')
                                        .attr('class', 'percentage-text')
                                        .text(function(datum) {
                                            return datum.percentage + "%";
                                        })
                                        .attr("x", function(datum, index) {
                                            return (index * width) + (width / 2);
                                        })
                                        .attr("y", 40)
                                        .attr("text-anchor", "middle")
                                        .attr("font-size", "10px");
                            }
                        });
            },
            renderHoleByHoleKey: function(key, _data, width, data_attr, obj_attr_func) {
                key.attr("transform", "translate(0,35)")
                        .each(function() {
                            var keyG = d3.select(this);
                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", 25)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum) {
                                        var svg = opts.svg;
                                        svg.selectAll('.holeSummary, .holeSummaryR, .holeSummaryL').each(function(o) {
                                            var thisOpacity = (obj_attr_func(o) === datum[data_attr]) ? 1 : 0.05;
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.holeSummary, .holeSummaryR, .holeSummaryL')
                                                .attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                        publicMethods.onParChanged(opts.par3, opts.par4, opts.par5);
                                    });
                            keyG.selectAll('.key-text').data(_data).enter()
                                    .append('text')
                                    .attr('class', 'key-text')
                                    .text(function(datum) {
                                        return datum.name;
                                    })
                                    .attr("font-size", "8px")
                                    .attr("text-anchor", "middle")
                                    .attr("x", function(datum, index) {
                                        return (index * width) + (width / 2);
                                    })
                                    .attr("y", 15)
                                    .attr("style", "fill: #FFFFFF")
                                    .attr("font-weight", "bold");

                            if (_data[0].percentage !== undefined && opts.totalHoles !== 0) {
                                keyG.selectAll('.percentage-text').data(_data).enter()
                                        .append('text')
                                        .attr('class', 'percentage-text')
                                        .text(function(datum) {
                                            return datum.percentage + "%";
                                        })
                                        .attr("x", function(datum, index) {
                                            return (index * width) + (width / 2);
                                        })
                                        .attr("y", 40)
                                        .attr("text-anchor", "middle")
                                        .attr("font-size", "10px");
                            }
                        });
            },
            renderHoleByHolePuttsKey: function(key) {
                var _data = [
                    {putt: 0, name: "0", color: privateMethods.birdieColor(-2), percentage: Math.abs(Math.floor(((opts.puttHoleByHoleKeyData[0] / opts.totalHoles) * 100) + 0.5))},
                    {putt: 1, name: "1", color: privateMethods.birdieColor(-1), percentage: Math.abs(Math.floor(((opts.puttHoleByHoleKeyData[1] / opts.totalHoles) * 100) + 0.5))},
                    {putt: 2, name: "2", color: opts.color.parColorSwatch, percentage: Math.abs(Math.floor(((opts.puttHoleByHoleKeyData[2] / opts.totalHoles) * 100) + 0.5))},
                    {putt: 3, name: "3", color: privateMethods.bogeyColor(1), percentage: Math.abs(Math.floor(((opts.puttHoleByHoleKeyData[3] / opts.totalHoles) * 100) + 0.5))},
                    {putt: 4, name: "4", color: privateMethods.bogeyColor(2), percentage: Math.abs(Math.floor(((opts.puttHoleByHoleKeyData[4] / opts.totalHoles) * 100) + 0.5))}
                ];
                privateMethods.renderHoleByHoleKey(key, _data, 25, "putt", function(obj) {
                    return obj.putts;
                });
            },
            renderHoleByHoleScoreKey: function(key) {
                var _data = [
                    {score: -3, name: "Albatross", color: privateMethods.birdieColor(-3), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[-3] / opts.totalHoles) * 100) + 0.5))},
                    {score: -2, name: "Eagle", color: privateMethods.birdieColor(-2), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[-2] / opts.totalHoles) * 100) + 0.5))},
                    {score: -1, name: "Birdie", color: privateMethods.birdieColor(-1), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[-1] / opts.totalHoles) * 100) + 0.5))},
                    {score: 0, name: "Par", color: opts.color.parColorSwatch, percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[0] / opts.totalHoles) * 100) + 0.5))},
                    {score: 1, name: "Bogey", color: privateMethods.bogeyColor(1), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[1] / opts.totalHoles) * 100) + 0.5))},
                    {score: 2, name: "Double Bogey", color: privateMethods.bogeyColor(2), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[2] / opts.totalHoles) * 100) + 0.5))},
                    {score: 3, name: "Other", color: privateMethods.bogeyColor(3), percentage: Math.abs(Math.floor(((opts.scoreHoleByHoleKeyData[3] / opts.totalHoles) * 100) + 0.5))}
                ];
                privateMethods.renderHoleByHoleKey(key, _data, 60, "score", function(obj) {
                    return obj.score - obj.par;
                });
            },
            renderHoleByHoleFwyTwoColorKey: function(key) {
                var _data = [
                    {fir: 1, name: "Fwy Hit", color: privateMethods.getFwyTwoColorSummaryColor(11), percentage: Math.abs(Math.floor(((opts.fwy2HoleByHoleKeyData[1] / opts.totalHoles) * 100) + 0.5))},
                    {fir: 0, name: "Fwy Missed", color: opts.color.parColorSwatch, percentage: Math.abs(Math.floor(((opts.fwy2HoleByHoleKeyData[0] / opts.totalHoles) * 100) + 0.5))}
                ];
                privateMethods.renderHoleByHoleKey(key, _data, 60, "fir", function(obj) {
                    return obj.fir;
                });
            },
            renderHoleByHoleGirKey: function(key) {
                var _data = [
                    {gir: 1, name: "GIR", color: privateMethods.getGirSummaryColor(16), percentage: Math.abs(Math.floor((opts.girHoleByHoleKeyData[1] / opts.totalHoles) * 100 + 0.5))},
                    {gir: 0, name: "No GIR", color: opts.color.parColorSwatch, percentage: Math.abs(Math.floor((opts.girHoleByHoleKeyData[0] / opts.totalHoles) * 100 + 0.5))}
                ];
                privateMethods.renderHoleByHoleKey(key, _data, 60, "gir", function(obj) {
                    return obj.gir;
                });
            },
            renderHoleByHoleFwyThreeColorKey: function(key) {
                var _data = [
                    {fir: -1, name: "Missed Left", color: opts.fwy3LeftOverallColorSwatch[2], percentage: Math.abs(Math.floor(((opts.fwy3HoleByHoleKeyData.left / opts.totalHoles) * 100) + 0.5))},
                    {fir: 1, name: "Fwy Hit", color: opts.fwy3OverallColorSwatch[14], percentage: Math.abs(Math.floor(((opts.fwy3HoleByHoleKeyData.hit / opts.totalHoles) * 100) + 0.5))},
                    {fir: 2, name: "Missed Right", color: opts.fwy3RightOverallColorSwatch[2], percentage: Math.abs(Math.floor(((opts.fwy3HoleByHoleKeyData.right / opts.totalHoles) * 100) + 0.5))},
                    {fir: 0, name: "Unknown", color: "#bcbddc", percentage: Math.abs(Math.floor(((opts.fwy3HoleByHoleKeyData.unknown / opts.totalHoles) * 100) + 0.5))}
                ];
                privateMethods.renderHoleByHoleKey(key, _data, 60, "fir", function(obj) {
                    return (obj.fir === 0) ? ((obj.rough === "LR") ? -1 : ((obj.rough === "RR") ? 2 : 0)) : 1;
                });
            },
            bogeyColor: function(position) {
                position = Math.abs(position);
                switch (position) {
                    case 1:
                    case 2:
                    case 3:
                        return opts.color.bogeyColorSwatch[position - 1];
                    default:
                        return opts.color.bogeyColorSwatch[2];
                }
            },
            birdieColor: function(position) {
                position = Math.abs(position);
                switch (position) {
                    case 1:
                    case 2:
                    case 3:
                        return opts.color.birdieColorSwatch[position - 1];
                    default:
                        return opts.color.birdieColorSwatch[2];
                }
            },
            renderOverallScoreKey: function(key) {
                var _data = [];
                var keyObject;
                for (var score = -8; score <= 8; score++) {
                    var color = (score === 0) ? opts.color.parColorSwatch : privateMethods.getSummaryColor(score);
                    var value = score;
                    if (value > 0) {
                        value = "+" + score;
                    }
                    keyObject = {color: color, value: value};
                    if (opts.totalRounds !== 0) {
                        keyObject.percentage = Math.abs(Math.floor(((opts.scoreOverAllKeyData[score] / opts.totalRounds) * 100) + 0.5));
                    }
                    _data.push(keyObject);
                }

                key.attr("transform", "translate(0,35)")
                        .each(function() {
                            var keyG = d3.select(this);

                            var width = 25;
                            var halfWidth = width / 2;

                            keyG.append("text").text("Round Strokes Relation to Par")
                                    .attr("font-size", "12px")
                                    .attr("text-anchor", "middle")
                                    .attr("x", width * 8 + halfWidth)
                                    .attr("y", -10)
                                    .attr("style", "fill: #000000");

                            if (_data[0].percentage !== undefined) {
                                keyG.selectAll('.percentage-text').data(_data).enter()
                                        .append('text')
                                        .attr('class', 'percentage-text')
                                        .text(function(datum) {
                                            return datum.percentage + "%";
                                        })
                                        .attr("x", function(datum, index) {
                                            return (index) * width + halfWidth;
                                        })
                                        .attr("y", 40)
                                        .attr("text-anchor", "middle")
                                        .attr("font-size", "10px");
                            }

                            keyG.selectAll('.key-item').data(_data).enter()
                                    .append('rect')
                                    .attr("class", "key-item")
                                    .attr("x", function(datum, index) {
                                        return index * width;
                                    })
                                    .attr("y", 0)
                                    .attr("width", width)
                                    .attr("height", width)
                                    .attr("style", function(datum, index) {
                                        return "fill: " + datum.color;
                                    })
                                    .on("mouseover", function(datum) {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').each(function(o) {
                                            var thisOpacity = ((o.score - o.par) === parseInt(datum.value)) ? 1 : 0.05;
                                            d3.select(this)
                                                    .attr('fill-opacity', thisOpacity)
                                                    .attr('stroke-opacity', thisOpacity);
                                        });
                                    })
                                    .on("mouseout", function() {
                                        var svg = opts.svg;
                                        svg.selectAll('.roundSummary').attr('stroke-opacity', 1)
                                                .attr('fill-opacity', 1);
                                    });

                            keyG.selectAll('.key-text').data(_data).enter()
                                    .append('text')
                                    .attr("class", 'key-text')
                                    .text(function(datum) {
                                        return datum.value;
                                    })
                                    .attr("x", function(datum, index) {
                                        return (index) * width + halfWidth;
                                    })
                                    .attr("y", 15)
                                    .attr("text-anchor", "middle")
                                    .attr("font-weight", "bold")
                                    .attr("font-size", "10px")
                                    .attr("style", "fill: #FFFFFF");
                        });
            },
            resetSize: function() {
                opts.svg.attr('height', (opts.data.length * (opts.dimension.roundHeight + opts.dimension.tournamentPadding) + (3 * opts.dimension.topMargin)));
            }
        };
        /** Code from where the execution starts **/
        this.each(function() {
            $.fn.d3Click = function() {
                this.each(function(i, e) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    e.dispatchEvent(evt);
                });
            };
            opts.svgSelector = $(this).attr('id');
            opts.svg = d3.select('#' + opts.svgSelector);
            privateMethods.resetSize();
            privateMethods.loadColors();
            privateMethods.drawColumnHeaders();
            privateMethods.drawViz();
            privateMethods.addInteractions();
            privateMethods.renderKey();
        });
        return publicMethods;
    };
})(jQuery, window, document, undefined);