;
(function($, window, document, undefined) {
    $.fn.menu = function(options) {
        var defaults = {
            dimension: {
                menuItemSize: 30,
                menuItemPadding: 2
            },
            onMenuItemClicked: function(mode) {
                //callback function
            }
        },
        opts = $.extend(true, {}, defaults, options);

        /** Code from where the execution starts **/
        this.each(function() {
            opts.parentSelector = $(this).attr('id');
            opts.svg = d3.select(this);
            drawMenu();
        });

        /** Internal Functions **/
        function getMenuData() {
            return [
                {color: '#a6cee3', mode: 'SCORE_MODE'}, {color: '#b2df8a', mode: 'FWY2_MODE'},
                {color: '#b2df8a', mode: 'FWY3_MODE'},
                {color: '#fb9a99', mode: 'GIR_MODE'}, {color: '#fdbf6f', mode: 'PUTTS_MODE'},
                {color: '#1f78b4', mode: 'SCORE_HOLE_BY_HOLE_MODE'}, {color: '#33a02c', mode: 'FWY2_HOLE_BY_HOLE_MODE'},
                {color: '#33a02c', mode: 'FWY3_HOLE_BY_HOLE_MODE'},
                {color: '#e31a1c', mode: 'GIR_HOLE_BY_HOLE_MODE'}, {color: '#ff7f00', mode: 'PUTTS_HOLE_BY_HOLE_MODE'}
            ];
        }

        function drawMenu() {
            opts.svg.selectAll('.menu-item').data(getMenuData()).enter()
                    .append('rect')
                    .attr("class", "menu-item")
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .attr("x", function(datum, index) {
                        return (index % 5) * (opts.dimension.menuItemSize + opts.dimension.menuItemPadding) + 65;
                    })
                    .attr("y", function(datum, index) {
                        return (index >= 5) ? (opts.dimension.menuItemSize + opts.dimension.menuItemPadding) + 16 : 16;
                    })
                    .attr("width", opts.dimension.menuItemSize)
                    .attr("height", opts.dimension.menuItemSize)
                    .attr("style", function(datum, index) {
                        return "fill: " + datum.color;
                    })
                    .on("click", function(datum) {
                        if (!$(this).hasClass('clicked')) {
                            $('.clicked').attr('class', 'menu-item');
                            $(this).attr('class', 'menu-item clicked');
                            opts.onMenuItemClicked.call(this, datum.mode);
                        } else {
                            $(this).attr('class', 'menu-item');
                        }
                    });

            $('.menu-item').hover(function() {
                $(this).animate({opacity: 1}, {duration: 100, complete: function() {
                        //console.log("Animation complete");
                    }
                });
            }, function() {
                if (!$(this).hasClass('clicked')) {
                    $(this).animate({opacity: 0.2}, {duration: 100, complete: function() {
                            //console.log("Hidden!");
                        }
                    });
                }
            });

            opts.svg.selectAll('.row-header').data(['Overall', 'Hole by Hole']).enter()
                    .append('text')
                    .text(function(datum, index) {
                        return datum;
                    })
                    .attr("text-anchor", "end")
                    .attr("font-size", "8px")
                    .attr("x", 60)
                    .attr("y", function(datum, index) {
                        return (opts.dimension.menuItemSize / 2 + 7) + ((opts.dimension.menuItemSize + opts.dimension.menuItemPadding) * index) + 16;
                    });

            opts.svg.selectAll('.column-header').data(['Score', 'FWY2', 'FWY3', 'GIR', 'Putts']).enter()
                    .append('text')
                    .text(function(datum, index) {
                        return datum;
                    })
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '8px')
                    .attr('x', function(datum, index) {
                        return (65 + (opts.dimension.menuItemSize / 2) + (index * (opts.dimension.menuItemSize + opts.dimension.menuItemPadding)));
                    })
                    .attr('y', 10);
        }
    };
})(jQuery, window, document, undefined);

