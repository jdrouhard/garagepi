(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['base64', '$http', '$cookies', '$rootScope', '$q', '$location'];

    function authenticationService(base64, $http, $cookies, $rootScope, $q, $location) {
        var service = {
            initialize: initialize,
            login: login,
            setCredentials: setCredentials,
            clearCredentials: clearCredentials
        };
        return service;

        function initialize() {
            $rootScope.authData = $cookies.get('x_authorization');
            if ($rootScope.authData) {
                $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.authData;
            }

            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if ($location.path() !== '/login' && !$rootScope.authData) {
                    $location.path('/login');
                }
            });
        }

        function login(username, password) {
            var authData = base64.encode(username + ':' + password);
            var authHeaders = {
                headers: {
                    'Authorization': 'Basic ' + authData
                },
                withCredentials: true
            };

            var webiopiLogin = $http.get('/api/*', authHeaders);
            var raspicamLogin = $http.get('/camera/index.html', authHeaders);

            return $q.all([webiopiLogin, raspicamLogin])
                .then(loginSuccess, loginFail);

            function loginSuccess() {
                service.setCredentials(authData);
            }

            function loginFail() {
                return $q.reject();
            };
        }

        function setCredentials(authData) {
            $rootScope.authData = authData;
            $http.defaults.headers.common.Authorization = 'Basic ' + authData;
            $cookies.put('x_authorization', authData);
        }

        function clearCredentials() {
            delete $rootScope.authData;
            $cookies.remove('x_authorization');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    }
})();
