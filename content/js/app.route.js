(function() {
    'use strict';

    angular
        .module('garagePi')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/partials/home.html'
            })
            .when('/login', {
                templateUrl: '/partials/login.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .otherwise({
                redirectTo: '/login/'
            });
    }
})();
