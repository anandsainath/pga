/**
jQuery plugin to handle all the data fetch related activities.
**/
;
(function($, undefined) {
    "use strict";
    var opts = {},
    	test = $.test = function(config) {
        	//constructor function..
        	test.init(config);
    	};

    $.extend(test, {
        /** Plugin default configuration values.. **/
        version: 1,
        defaults: {
            data: undefined,
            debug: false,
            url: './data/data_tournament.php?id=1810',
        	onDataLoad: function(data){
                console.log("Data loaded: ", data);
            }
        },
        /*** GLOBAL Functions ***/
        /**
         * Initialization function..
         * @param {Object} options
         */
        init: function(options) {
            if(opts.debug){
                console.log("Init called in dataLoader.js");
            }
            /** Extending the default options of the plugin.. **/
            opts = $.extend(true, {}, test.defaults, options);
            d3.json(opts.url, methods.onDataLoad);
        }
        /*** /GLOBAL Functions ***/
    });

    /** Helper functions in the scope of the plugin **/
    var methods = {
        onDataLoad: function(data){
            if(opts.debug){
                console.log("onDataLoad method called with data", data);
            }
            opts.data = data;
            opts.onDataLoad.call(this, opts.data);
        }
    };
})(jQuery, undefined);