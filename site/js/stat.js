/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;
(function($, window, document, undefined) {
    $.fn.stat = function(options) {
        var defaults = {
            data: undefined,
            dimension: {
                width: 900,
                height: 300,
                padding: {
                    left: 25,
                    right: 25
                },
                tick: {
                    width: 5
                },
                bar: {
                    height: 100
                }
            }
        },
        opts = $.extend(true, {}, defaults, options);

        var publicMethods = {
        };

        var privateMethods = {
            drawViz: function() {
                var no_of_bars = opts.data.length;
                opts.spacing = (opts.dimension.width - (opts.dimension.padding.left + opts.dimension.padding.right)) / no_of_bars;
                opts.svg.selectAll('.bars').data(opts.data).enter()
                        .append('line')
                        .attr('class', 'bars')
                        .attr('x1', function(datum, index) {
                            return opts.dimension.padding.left + ((index + 1) * opts.spacing);
                        })
                        .attr('y1', 180)
                        .attr('x2', function(datum, index) {
                            return opts.dimension.padding.left + ((index + 1) * opts.spacing);
                        })
                        .attr('y2', 80)
                        .attr("stroke-width", "2px")
                        .attr("style", "stroke: #000000;");

                opts.svg.selectAll('.tick').data(opts.data).enter()
                        .append('circle')
                        .attr('class', 'tick')
                        .attr('cx', function(datum, index) {
                            return opts.dimension.padding.left + ((index + 1) * opts.spacing);
                        })
                        .attr('cy', function(datum, index) {
                            return 80 + ((datum.rank / 140) * opts.dimension.bar.height);
                        })
                        .attr('r', opts.dimension.tick.width).attr("style", "fill: #FF0000;");

                opts.svg.selectAll('.column-stat').data(opts.data).enter()
                        .append('text')
                        .attr('class', 'column-stat')
                        .text(function(datum) {
                            return datum.value;
                        })
                        .attr('x', function(datum, index) {
                            return opts.dimension.padding.left + (((index + 1) * opts.spacing) - (2 * opts.dimension.tick.width));
                        })
                        .attr('y', function(datum, index) {
                            return 78 + ((datum.rank / 140) * opts.dimension.bar.height);
                        })
                        .attr("text-anchor", "end")
                        .attr("font-size", "14px")
                        .attr("style", "fill: #000000;");
                
                opts.svg.selectAll('.column-rank').data(opts.data).enter()
                        .append('text')
                        .attr('class', 'column-rank')
                        .text(function(datum) {
                            return "Rank " + datum.rank;
                        })
                        .attr('x', function(datum, index) {
                            return opts.dimension.padding.left + (((index + 1) * opts.spacing) - (2 * opts.dimension.tick.width));
                        })
                        .attr('y', function(datum, index) {
                            return 88 + ((datum.rank / 140) * opts.dimension.bar.height);
                        })
                        .attr("text-anchor", "end")
                        .attr("font-size", "10px")
                        .attr("style", "fill: #000000;");

                opts.svg.selectAll('.column-header').data(opts.data).enter()
                        .append('text')
                        .attr('class', 'column-header')
                        .attr('x', function(datum, index) {
                            return opts.dimension.padding.left + ((index + 1) * opts.spacing);
                        })
                        .attr('y', 35)
                        .attr("text-anchor", "middle")
                        .attr("font-size", "10px")
                        .attr("style", "fill: #000000;")
                        .each(function(datum){
                            var _this = d3.select(this);
                            _this.selectAll('.tspan').data(datum.key).enter()
                                .append("tspan")
                                .attr("x", _this.attr("x"))
                                .attr("dy", "1.2em")
                                .text(function(datum) {
                                    console.log(datum);
                                    return datum;
                                });
                        });
                            
            }
        };
        /** Code from where the execution starts **/
        this.each(function() {
            opts.svgSelector = $(this).attr('id');
            opts.svg = d3.select('#' + opts.svgSelector);

            privateMethods.drawViz();
        });
        return publicMethods;
    };
})(jQuery, window, document, undefined);