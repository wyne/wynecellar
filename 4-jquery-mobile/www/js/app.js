requirejs.config({
    baseUrl: "/js/", // Default from data-main path in index.html
    paths: {
        jquery: 'libs/jquery-1.8.2.min',
        'jquery.mobile': 'libs/jquery.mobile-1.2.1.min',
        'jquery.mobile-config': 'libs/jquery.mobile-config',
        underscore: 'libs/underscore-1.4.4-min',
        backbone: 'libs/backbone-1.0.0-min',
        stackmob: 'libs/stackmob-js-0.9.2-min',
        stackmobinit: 'stackmob-init',
        templates: '../templates'
    },
    shim: {
        'jquery.mobile': ['jquery', 'jquery.mobile-config'],
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'stackmob': {
            deps: ['jquery', 'backbone'],
            exports: 'StackMob'
        },
        'stackmob-init': {
            deps: ['stackmob']
        }
    }
});

require([
    "router"
], function(Router) {
    Router.initialize();
});