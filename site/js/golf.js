;
(function($, window, document, undefined) {
    $.fn.golf = function(options) {
        var defaults = {
            data: undefined,
            mode: undefined,
            parentSelector: undefined,
            svgSelector: undefined,
            par3: true,
            par4: true,
            par5: true,
            dimension: {
                roundWidth: 126,
                roundPadding: 5,
                roundHeight: 20,
                tournamentPadding: 8,
                topMargin: 15
            },
            color: {
                bogeyColorSwatch: ["#9ECAE1", "#4292C6", "#08519C"],
                birdieColorSwatch: ["#FEE6CE", "#FDAE6B", "#D94801"],
                parColorSwatch: "#EFEFEF",
                fwyColor: "#C7E9C0",
                fwyMissedColor: "#FFF5EB",
                girColor: "#A1D99B",
                girMissedColor: "#FFF5EB",
                //puttsColorSwatch: ["#FFFFBF", "#74ADD1", "#D9D9D9", "#D73027"],
                puttsOverallColorSwatch: [],
                girOverallColorSwatch: [],
                fwyOverallColorSwatch: [],
                fwy3OverallColorSwatch: [],
                fwy3LeftOverallColorSwatch: [],
                fwy3RightOverallColorSwatch: [],
                puttsColorSwatch: ["#FDAE6B", "#FEE6CE", "#FFF5EB", "#9ECAE1", "#08519C"],
                //negativeColor : ["#FEE6CE", "#FDD0A2", "#FDAE6B", "#FD8D3C", "#F16913", "#D94801", "#A63603", "#7F2704"],
                negativeColor: ["#FFF6DF", "#FFECC0", "#FFE3A0", "#FFD980", "#FFD060", "#FFBD21", "#FFB61C", "#FFAE18"],
                positiveColor: ["#E4EDEA", "#D7E8E2", "#CCECE1", "#BEEADB", "#AFEAD6", "#86d9CF", "#56C7CB", "#02A1B7"]
            }
        },
        mode = {
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
        switch (opts.mode) {
            case mode.putt.overall:
                var parSummarySeedColorSwatch = ["#398d5b", "#53a46d", "#6bbd81", "#92d194", "#b5e1b1", "#d3eece", "#eaf7e7"];
                var parSummaryColors = d3.scale.linear()
                        .domain(d3.range(0, 1, 1.0 / (parSummarySeedColorSwatch.length - 1)))
                        .range(parSummarySeedColorSwatch);
                var parRange = d3.scale.linear().domain([0, 18]).range([0, 1]);
                opts.puttsOverallColorSwatch = [];
                for (var i = 0; i <= 18; i++) {
                    opts.puttsOverallColorSwatch.push(parSummaryColors(parRange(i)));
                }
                break;
            case mode.gir.overall:
                var girSummarySeedColorSwatch = ["#eaf7e7", "#d3eece", "#b5e1b1", "#92d194", "#6bbd81", "#53a46d"];
                var girSummaryColors = d3.scale.linear()
                        .domain(d3.range(0, 1, 1.0 / (girSummarySeedColorSwatch.length - 1)))
                        .range(girSummarySeedColorSwatch);
                var girRange = d3.scale.linear().domain([0, 14]).range([0, 1]);
                opts.girOverallColorSwatch = [];
                for (var i = 0; i <= 14; i++) {
                    opts.girOverallColorSwatch.push(girSummaryColors(girRange(i)));
                }
                break;
            case mode.fwy.twoColor.overall:
                var fwySummarySeedColorSwatch = ["#eaf7e7", "#d3eece", "#b5e1b1", "#92d194", "#6bbd81", "#53a46d"];
                var fwySummaryColors = d3.scale.linear()
                        .domain(d3.range(0, 1, 1.0 / (fwySummarySeedColorSwatch.length - 1)))
                        .range(fwySummarySeedColorSwatch);
                var fwyRange = d3.scale.linear().domain([0, 14]).range([0, 1]);
                opts.fwyOverallColorSwatch = [];
                for (var i = 0; i <= 14; i++) {
                    opts.fwyOverallColorSwatch.push(fwySummaryColors(fwyRange(i)));
                }
                break;
            case mode.fwy.threeColor.overall:
            case mode.fwy.threeColor.holeByHole:
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
                break;
        }


        /** Code from where the execution starts **/
        this.each(function() {
            drawViz();
            switch (opts.mode) {
                case mode.score.overall:
                    renderOverallKey();
                    break;
                case mode.fwy.twoColor.overall:
                    renderFwyOverallKey();
                    break;
                case mode.putt.overall:
                    renderPuttOverallKey();
                    break;
                case mode.gir.overall:
                    renderGirOverallKey();
                    break;
            }
        });


        function renderPuttOverallKey() {
            var $ul = $('#putts-overall-key > ul');
            for (var i = 0; i <= 18; i++) {
                var color = opts.puttsOverallColorSwatch[i];
                $ul.append('<li> <span class="color-box" style="background: ' + color + ';"></span> ' + (i + 18) + ' putts</li>');
            }
        }

        function renderGirOverallKey() {
            var $ul = $('#gir-overall-key > ul');
            for (var i = 0; i <= 14; i++) {
                var color = opts.girOverallColorSwatch[i];
                $ul.append('<li> <span class="color-box" style="background: ' + color + ';"></span> ' + i + ' GIRs</li>');
            }
        }

        function renderFwyOverallKey() {
            var $ul = $('#fir2-overall-key > ul');
            for (var i = 0; i <= 14; i++) {
                var color = opts.fwyOverallColorSwatch[i];
                $ul.append('<li> <span class="color-box" style="background: ' + color + ';"></span> ' + i + ' FWYs</li>');
            }
        }

        var publicMethods = {
            onParChanged: function(par3, par4, par5) {
                opts.svg.selectAll('.holeSummary, .holeSummaryL, .holeSummaryR').style('stroke-opacity', function(o) {
                    var thisOpacity;
                    switch (o.par) {
                        case 3:
                            thisOpacity = (par3) ? 1 : 0;
                            break;
                        case 4:
                            thisOpacity = (par4) ? 1 : 0;
                            break;
                        case 5:
                            thisOpacity = (par5) ? 1 : 0;
                            break;
                    }
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });
                opts.par3 = par3;
                opts.par4 = par4;
                opts.par5 = par5;
            }
        };

        return publicMethods;

        function drawViz() {
            opts.dimension.nextTournamentLocation = opts.dimension.roundHeight + opts.dimension.tournamentPadding;
            opts.parentSelector = $(this).attr('id');
            var svg = d3.select(opts.svgSelector + " svg");
            opts.svg = svg;

            svg.selectAll('.roundLables').data(["Round 1", "Round 2", "Round 3", "Round 4"]).enter()
                    .append("text")
                    .text(function(datum, index) {
                        return datum;
                    })
                    .attr("x", "216")
                    .attr("y", "15")
                    .attr("class", "roundLables")
                    .attr("text-anchor", "middle")
                    .attr("style", "fill: #000000;")
                    .attr("font-size", "10px")
                    .attr("transform", function(datum, index) {
                        var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                        x += (opts.dimension.roundWidth / 2);
                        return "translate(" + x + ",0)";
                    })
                    .on("mouseover", function(o) {
                        var round = parseInt(o.charAt(o.length - 1));
                        svg.selectAll('.round').style('stroke-opacity', function(o) {
                            if (o.roundSummary !== null) {
                                var thisOpacity = (round === o.roundSummary.round) ? 1 : 0.05;
                                this.setAttribute('fill-opacity', thisOpacity);
                                return thisOpacity;
                            } else {
                                this.setAttribute('fill-opacity', 0.05);
                                return 0.05;
                            }
                        });
                    })
                    .on("mouseout", function(o) {
                        svg.selectAll('.round').style('stroke-opacity', function(o) {
                            this.setAttribute('fill-opacity', 1);
                            return 1;
                        });
                    })
                    .on("click", function(selectedRound) {
                        svg.selectAll('.roundLables, .columnHeader').each(function() {
                            if (arguments[0] !== selectedRound) {
                                d3.select(this).attr('data-sort', null);
                            }
                        });

                        var _this = d3.select(this);
                        window.sortedColumn = _this.data()[0];
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
                        window.sortOrder = sortOrder;

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

                        svg.selectAll('.tournaments')
                                .sort(sortItemsOnRoundScore)
                                .transition()
                                .delay(function(datum, index) {
                                    return index * 50;
                                })
                                .duration(1000)
                                .attr("transform", function(datum, index) {
                                    return "translate(216," + (15 + (23 * index)) + ")";
                                });

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
                    });

            svg.selectAll('.sortArrow').data(["Round 1", "Round 2", "Round 3", "Round 4"]).enter()
                    .append("image")
                    .attr("class", "sortArrow")
                    .attr("transform", function(datum, index) {
                        var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                        x += (opts.dimension.roundWidth / 2);
                        x += 216;
                        return "translate(" + x + ",0)";
                    })
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("xlink:href", "/images/sort_neutral.png")
                    .attr("x", "24")
                    .attr("y", "6")
                    .attr("width", "7")
                    .attr("height", "10");

            function sort(_this, columnHeader, attributeName) {
                var data_sort = _this.attr('data-sort');
                svg.selectAll('.roundLables, .columnHeader').each(function() {
                    if (arguments[0] !== columnHeader) {
                        _this.attr('data-sort', null);
                    }
                });

                sortItemsOnAttribute = function(a, b) {
                    if (sortOrder) {
                        return b.information[attributeName] - a.information[attributeName];
                    }
                    return a.information[attributeName] - b.information[attributeName];
                };

                var sortOrder;
                if (data_sort === null || data_sort === 'descending') {
                    _this.attr('data-sort', 'ascending');
                    sortOrder = true;
                } else {
                    _this.attr('data-sort', 'descending');
                    sortOrder = false;
                }

                svg.selectAll('.tournaments')
                        .sort(sortItemsOnAttribute)
                        .transition()
                        .delay(function(datum, index) {
                            return index * 50;
                        })
                        .duration(1000)
                        .attr("transform", function(datum, index) {
                            return "translate(216," + (15 + (23 * index)) + ")";
                        });

                svg.selectAll('.sortArrow').each(function() {
                    if (arguments[0] !== columnHeader) {
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
            }

            svg.append("text").attr("class", "columnHeader")
                    .text("Position")
                    .data(["Position"])
                    .attr("text-anchor", "begin")
                    .attr("style", "fill: #000000;")
                    .attr("x", "0")
                    .attr("y", "15")
                    .attr("font-size", "10px")
                    .attr("transform", "translate(930, 0)")
                    .on("click", function(columnHeader) {
                        var _this = d3.select(this);
                        sort(_this, columnHeader, 'finishPosition');
                    });

            svg.append("image")
                    .attr("class", "sortArrow")
                    .data(["Position"])
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("xlink:href", "/images/sort_neutral.png")
                    .attr("transform", "translate(930, 0)")
                    .attr("x", "38")
                    .attr("y", "7")
                    .attr("width", "7")
                    .attr("height", "10");

            svg.append("text").attr("class", "columnHeader")
                    .text("Total Score")
                    .data(["Total Score"])
                    .attr("text-anchor", "begin")
                    .attr("style", "fill: #000000;")
                    .attr("x", "50")
                    .attr("y", "15")
                    .attr("font-size", "10px")
                    .attr("transform", "translate(930, 0)")
                    .on("click", function(columnHeader) {
                        var _this = d3.select(this);
                        sort(_this, columnHeader, 'totalScore');
                    });

            svg.append("image")
                    .attr("class", "sortArrow")
                    .data(["Total Score"])
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("xlink:href", "/images/sort_neutral.png")
                    .attr("transform", "translate(930, 0)")
                    .attr("x", "102")
                    .attr("y", "7")
                    .attr("width", "7")
                    .attr("height", "10");

            svg.append("text").attr("class", "columnHeader")
                    .text("Par Score")
                    .data(["Par Score"])
                    .attr("text-anchor", "begin")
                    .attr("style", "fill: #000000;")
                    .attr("x", "115")
                    .attr("y", "15")
                    .attr("font-size", "10px")
                    .attr("transform", "translate(930, 0)")
                    .on("click", function(columnHeader) {
                        var _this = d3.select(this);
                        sort(_this, columnHeader, 'underPar');
                    });

            svg.append("image")
                    .attr("class", "sortArrow")
                    .data(["Par Score"])
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .attr("xlink:href", "/images/sort_neutral.png")
                    .attr("transform", "translate(930, 0)")
                    .attr("x", "162")
                    .attr("y", "7")
                    .attr("width", "7")
                    .attr("height", "10");


            svg.selectAll(".tournaments").data(opts.data).enter()
                    .append("g")
                    .attr("class", "tournaments")
                    .attr("transform", function(datum, index) {
                        return "translate(216," + ((index * opts.dimension.nextTournamentLocation) + opts.dimension.topMargin) + ")";
                    })
                    .each(function() {
                        var tournament = d3.select(this);
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
                                });

                        tournament.selectAll(".tournamentStat").data([arguments[0].information]).enter()
                                .append("g")
                                .attr("class", "tournamentStat")
                                .attr("transform", "translate(714, 25)")
                                .each(function() {
                                    var tournamentStat = d3.select(this);
                                    tournamentStat.append("text")
                                            .text(arguments[0].finishPositionText)
                                            .attr("x", "20.5")
                                            .attr("y", "0")
                                            .attr("text-anchor", "middle")
                                            .attr("style", "fill: #000000;")
                                            .attr("font-size", "10px");

                                    tournamentStat.append("text")
                                            .text(arguments[0].totalScore)
                                            .attr("x", "73.5")
                                            .attr("y", "0")
                                            .attr("text-anchor", "middle")
                                            .attr("style", "fill: #000000;")
                                            .attr("font-size", "10px");

                                    var parScore = arguments[0].underPar;
                                    if (parScore > 0) {
                                        parScore = "+" + parScore;
                                    }

                                    tournamentStat.append("text")
                                            .text(parScore)
                                            .attr("x", "140.5")
                                            .attr("y", "0")
                                            .attr("text-anchor", "middle")
                                            .attr("style", "fill: #000000;")
                                            .attr("font-size", "10px");
                                });

                        tournament.selectAll('.round').data(arguments[0].eventSummary).enter()
                                .append("g")
                                .attr("class", "round")
                                .attr("transform", function(datum, index) {
                                    var x = (index * opts.dimension.roundWidth) + ((index + 1) * opts.dimension.roundPadding) + 180;
                                    return "translate(" + x + "," + opts.dimension.roundHeight + ")";
                                })
                                .each(function() {
                                    if (arguments[0].holeDetails === undefined || arguments[0].holeDetails === null) {
                                        return false;
                                    }
                                    var round = d3.select(this);
                                    switch (opts.mode) {
                                        case mode.score.overall:
                                            drawSummary(round, [arguments[0].roundSummary], function(datum, index) {
                                                if (datum !== null) {
                                                    var diff = datum.score - datum.par;
                                                    var color = getSummaryColor(diff);
                                                    return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                                }
                                            });
                                            break;
                                        case mode.score.holeByHole:
                                            drawHole(round, arguments[0].holeDetails, function(datum, index) {
                                                var diff = datum.score - datum.par;
                                                var color = (diff === 0) ? opts.color.parColorSwatch : ((diff < 0) ? birdieColor(diff) : bogeyColor(diff));
                                                return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                            });
                                            break;
                                        case mode.fwy.twoColor.overall:
                                            drawSummary(round, [arguments[0].roundSummary], function(datum, index) {
                                                var diff = datum.fir;
                                                var color = opts.fwyOverallColorSwatch[Math.min(Math.abs(diff), 14)];
                                                return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                            });
                                            break;
                                        case mode.fwy.twoColor.holeByHole:
                                            drawHole(round, arguments[0].holeDetails, function(datum, index) {
                                                var color = (datum.fir === 0) ? opts.color.fwyMissedColor : opts.color.fwyColor;
                                                return "fill:" + color + ";";
                                            });
                                            break;
                                        case mode.fwy.threeColor.overall:
                                            drawSummary(round, [arguments[0].roundSummary], function(datum, index) {
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
                                                return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                            });
                                            break;
                                        case mode.fwy.threeColor.holeByHole:
                                            drawHole(round, arguments[0].holeDetails, function(datum, index) {
                                                var color = (datum.fir === 0) ? ((datum.rough === "LR") ? opts.fwy3LeftOverallColorSwatch[2] : ((datum.rough === "RR") ? opts.fwy3RightOverallColorSwatch[2] : "#bcbddc")) : opts.fwy3OverallColorSwatch[14];
                                                return "fill:" + color + ";";
                                            });
                                            break;
                                        case mode.gir.overall:
                                            drawSummary(round, [arguments[0].roundSummary], function(datum, index) {
                                                var diff = datum.gir;
                                                var color = opts.girOverallColorSwatch[Math.min(Math.abs(diff), 14)];
                                                return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                            });
                                            break;
                                        case mode.gir.holeByHole:
                                            drawHole(round, arguments[0].holeDetails, function(datum, index) {
                                                var color = (datum.gir === 0) ? opts.color.girMissedColor : opts.color.girColor;
                                                return "fill:" + color + ";";
                                            });
                                            break;
                                        case mode.putt.overall:
                                            drawSummary(round, [arguments[0].roundSummary], function(datum, index) {
                                                var diff = datum.putt - 18;
                                                var color = opts.puttsOverallColorSwatch[Math.min(Math.abs(diff), 18)];
                                                return "fill:" + color + "; vector-effect: non-scaling-stroke;";
                                            });
                                            break;
                                        case mode.putt.holeByHole:
                                            drawHole(round, arguments[0].holeDetails, function(datum, index) {
                                                var color = opts.color.puttsColorSwatch[Math.min(datum.putts, 4)];
                                                return "fill:" + color + ";";
                                            });
                                            break;
                                    }

                                    round.selectAll('.hole-details')
                                            .data([arguments[0].roundSummary]).enter()
                                            .append("g")
                                            .attr("class", "hole-details")
                                            .attr("transform", "translate(150,0)")
                                            .each(function() {
                                                var holeDetails = d3.select(this);

                                                holeDetails.append("text").text("{")
                                                        .attr("class", "bracket hover")
                                                        .attr("text-anchor", "end")
                                                        .attr("x", 2)
                                                        .attr("y", 24);

                                                holeDetails.append("text")
                                                        .attr("class", "score hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", -15)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "_score");
                                                            fir.append('tspan').attr("class", "label").text(" SCORE");
                                                        });

                                                holeDetails.append("text")
                                                        .attr("class", "fir hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 2)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "_fir");
                                                            fir.append('tspan').attr("class", "label").text(" FWY");
                                                        });

                                                holeDetails.append("text")
                                                        .attr("class", "gir hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 19)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "_gir");
                                                            fir.append('tspan').attr("class", "label").text(" GIR");
                                                        });

                                                holeDetails.append("text")
                                                        .attr("class", "putt hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 36)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "_putts");
                                                            fir.append('tspan').attr("class", "label").text(" PUTTS");
                                                        });
                                            });

                                    round.selectAll('.round-details')
                                            .data([arguments[0].roundSummary]).enter()
                                            .append("g")
                                            .attr("class", "round-details")
                                            .attr("transform", "translate(150,0)")
                                            .each(function() {
                                                var roundDetails = d3.select(this);

                                                roundDetails.append("text")
                                                        .text("{")
                                                        .attr("class", "bracket hover")
                                                        .attr("text-anchor", "end")
                                                        .attr("x", 2)
                                                        .attr("y", 24);

                                                if (arguments[0].score !== null) {
                                                    roundDetails.append("text")
                                                            .attr("class", "score hover")
                                                            .attr("text-anchor", "begining")
                                                            .attr("x", 10)
                                                            .attr("y", -15)
                                                            .text(arguments[0].score)
                                                            .each(function() {
                                                                var fir = d3.select(this);
                                                                fir.append('tspan').attr("class", "label").text(" SCORE");
                                                            });
                                                }


                                                var fir = arguments[0].fir;
                                                if (fir < 10) {
                                                    fir = "0" + fir;
                                                }

                                                roundDetails.append("text").text(fir)
                                                        .attr("class", "fir hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 2)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "label").text(" FWY");
                                                        });

                                                var gir = arguments[0].gir;
                                                if (gir < 10) {
                                                    gir = "0" + gir;
                                                }
                                                roundDetails.append("text").text(gir)
                                                        .attr("class", "gir hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 19)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "label").text(" GIR");
                                                        });

                                                roundDetails.append("text").text(arguments[0].putt)
                                                        .attr("class", "putt hover")
                                                        .attr("text-anchor", "begining")
                                                        .attr("x", 10)
                                                        .attr("y", 36)
                                                        .each(function() {
                                                            var fir = d3.select(this);
                                                            fir.append('tspan').attr("class", "label").text(" PUTTS");
                                                        });
                                            });
                                });
                    });

            svg.selectAll('.tournamentName').on("mouseover", function(o) {
                $('.sortArrow').attr('opacity', '0.05');

                svg.selectAll('.tournaments').style('stroke-opacity', function(tournamentData) {
                    var thisOpacity = (o.information.name === tournamentData.information.name) ? 1 : 0.05;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });

            }).on("mouseout", function(o) {
                $('.sortArrow').attr('opacity', '1');
                svg.selectAll('.tournaments').style('stroke-opacity', function(tournamentData) {
                    var thisOpacity = 1;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                });
            });

            svg.selectAll('.showScores').on("mouseover", function(o) {
                svg.selectAll('.round').style('stroke-opacity', function(roundStat) {
                    if (roundStat.roundSummary !== null) {
                        var thisOpacity = ((o.round === roundStat.roundSummary.round) && (o.name === roundStat.roundSummary.name)) ? 1 : 0.05;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    } else {
                        this.setAttribute('fill-opacity', 0.5);
                        return 0.5;
                    }
                });
                $(this).parent().find('.round-details').toggle();
                $('.roundLables').attr('class', 'roundLables fade-round');
                $('.tournamentStat, .columnHeader').attr('fill-opacity', 0.05);
                $('.sortArrow').attr('opacity', '0.05');
            }).on("mouseout", function(o) {
                svg.selectAll('.round').style('stroke-opacity', function(roundStat) {
                    this.setAttribute('fill-opacity', 1);
                    return 1;
                });
                $(this).parent().find('.round-details').toggle();
                $('.roundLables').attr('class', 'roundLables');
                $('.tournamentStat, .columnHeader').attr('fill-opacity', 1);
                $('.sortArrow').attr('opacity', '1');
            });

            svg.selectAll('.showHoleScores').on("mouseover", function(o) {
                svg.selectAll('.round').style('stroke-opacity', function(roundStat) {
                    if (roundStat.roundSummary !== null) {
                        var thisOpacity = ((o.roundSummary.round === roundStat.roundSummary.round) && (o.roundSummary.name === roundStat.roundSummary.name)) ? 1 : 0.05;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    } else {
                        this.setAttribute('fill-opacity', 0.05);
                        return 0.05;
                    }
                });
                $(this).parent().find('.hole-details').toggle();
                $('.roundLables').attr('class', 'roundLables fade-round');
                $('.tournamentStat, .columnHeader').attr('fill-opacity', 0.05);
                $('.sortArrow').attr('opacity', '0.05');
            }).on("mouseout", function(o) {
                svg.selectAll('.round').style('stroke-opacity', function(roundStat) {
                    this.setAttribute('fill-opacity', 1);
                    return 1;
                });
                $(this).parent().find('.hole-details').toggle();
                $('.roundLables').attr('class', 'roundLables');
                $('.tournamentStat, .columnHeader').attr('fill-opacity', 1);
                $('.sortArrow').attr('opacity', '1');
            });

            svg.selectAll('.holeSummary, .holeSummaryL, .holeSummaryR').on("mouseover", function(data) {
                var $holeDetail = $(this).parents('.round:first').find('.hole-details');
                $holeDetail.find('._score')[0].textContent = data.score;
                $holeDetail.find('._fir')[0].textContent = data.fir;
                $holeDetail.find('._gir')[0].textContent = data.gir;
                $holeDetail.find('._putts')[0].textContent = data.putts;
            });

        }

        function renderOverallKey() {
            var $ul = $('#overall_key > ul');
            for (var score = 62; score <= 78; score++) {
                var color = (score === 70) ? opts.color.parColorSwatch : getSummaryColor(score - 70);
                $ul.append('<li> <span class="color-box" style="background: ' + color + ';"></span> ' + (score - 70) + '</li>');
            }
        }

        function getSummaryColor(diff) {
            if (diff < 0) {
                return opts.color.negativeColor[Math.abs(Math.max(diff, -8)) - 1];
            } else if (diff > 0) {
                return opts.color.positiveColor[Math.abs(Math.min(diff, 8)) - 1];
            } else if (diff === 0) {
                return opts.color.parColorSwatch;
            }
        }

        function bogeyColor(position) {
            position = Math.abs(position);
            switch (position) {
                case 1:
                case 2:
                case 3:
                    return opts.color.bogeyColorSwatch[position - 1];
                default:
                    return opts.color.bogeyColorSwatch[2];
            }
        }

        function birdieColor(position) {
            position = Math.abs(position);
            switch (position) {
                case 1:
                case 2:
                case 3:
                    return opts.color.birdieColorSwatch[position - 1];
                default:
                    return opts.color.birdieColorSwatch[2];
            }
        }

        function drawSummary(round, roundSummary, styleFunction) {
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
                    .attr("style", styleFunction);
        }

        function drawHole(round, holeDetails, styleFunction) {
            var oneToSeventeenHoles = [];
            round.append('g').attr("class", "showHoleScores");


            $.each(holeDetails, function(index, datum) {
                if ((datum.par === 3 && opts.par3) || (datum.par === 4 && opts.par4) || (datum.par === 5 && opts.par5)) {
                    if (index === 0) {
                        round.select('.showHoleScores').selectAll('.holeSummaryL').data([datum]).enter()
                                .append("path")
                                .attr("class", "holeSummaryL")
                                .attr("d", leftRoundedRect(0, 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5))
                                .attr("style", styleFunction);
                    } else if (index === 17) {
                        round.select('.showHoleScores').selectAll('.holeSummaryR').data([datum]).enter()
                                .append("path")
                                .attr("class", "holeSummaryR")
                                .attr("d", rightRoundedRect(17 * (opts.dimension.roundWidth / 18), 0, (opts.dimension.roundWidth / 18), opts.dimension.roundHeight, 5))
                                .attr("style", styleFunction);
                    } else {
                        datum.index = index;
                        oneToSeventeenHoles.push(datum);
                    }
                }
            });

            round.select('.showHoleScores').selectAll('.holeSummary')
                    .data(oneToSeventeenHoles).enter()
                    .append("rect")
                    .attr("class", "holeSummary")
                    .attr("x", function(datum, index) {
                        return (datum.index) * (opts.dimension.roundWidth / 18);
                    })
                    .attr("y", 0)
                    .attr("width", (opts.dimension.roundWidth / 18))
                    .attr("height", opts.dimension.roundHeight)
                    .attr("style", styleFunction);
        }

        // Returns path data for a rectangle with rounded right corners.
        // The top-left corner is ⟨x,y⟩.
        function rightRoundedRect(x, y, width, height, radius) {
            return rounded_rect(x, y, width, height, radius, false, true, false, true);
        }

        function leftRoundedRect(x, y, width, height, radius) {
            return rounded_rect(x, y, width, height, radius, true, false, true, false);
        }

        function rounded_rect(x, y, w, h, r, tl, tr, bl, br) {
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
        }

    };
})(jQuery, window, document, undefined);