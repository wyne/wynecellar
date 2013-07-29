requirejs.config({
    baseUrl: "/js/", // Default from data-main path in index.html
    paths: {
        jquery: 'libs/jquery-1.9.1.min',
        underscore: 'libs/underscore-1.4.4-min',
        backbone: 'libs/backbone-1.0.0-min',
        stackmob: 'libs/stackmob-js-0.9.2-min',
        stackmobinit: 'stackmob-init',
        templates: '../templates'
    },
    shim: {
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