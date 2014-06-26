/**
 jQuery plugin to handle all the data fetch related activities.
 **/
;
(function($, undefined) {
    "use strict";
    var opts = {},
            dataLoader = $.dataLoader = function() {
                //constructor function..
                dataLoader.init(arguments[0]);
            };

    $.extend(dataLoader, {
        /** Plugin default configuration values.. **/
        version: 1,
        defaults: {
            data: undefined,
            debug: false,
            params: '/1810',
            //url: './data/data_tournament.php?id=1810',
            url: "/get-data",
            onDataLoad: function(data) {
                console.log("Data loaded: ", data);
            }
        },
        /*** GLOBAL Functions ***/
        /**
         * Initialization function..
         * @param {Object} options
         */
        init: function(options) {
            if (opts.debug) {
                console.log("Init called in dataLoader.js");
            }
            /** Extending the default options of the plugin.. **/
            opts = $.extend(true, {}, dataLoader.defaults, options);
            var url = opts.url + opts.params;
            d3.json(url, methods.onDataLoad);
        }
        /*** /GLOBAL Functions ***/
    });

    /** Helper functions in the scope of the plugin **/
    var methods = {
        onDataLoad: function(data) {
            if (opts.debug) {
                console.log("onDataLoad method called with data", data);
            }
            opts.data = data;
            opts.onDataLoad.call(this, opts.data);
        }
    };
})(jQuery, undefined);