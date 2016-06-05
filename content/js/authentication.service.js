(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['base64', '$http', '$cookies', '$rootScope', '$timeout', '$q', '$location'];

    function authenticationService(base64, $http, $cookies, $rootScope, $timeout, $q, $location) {
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

        function login(username, password, callback) {
            var authdata = base64.encode(username + ':' + password);
            var webiopiLogin = $http.get('/api/*', {
                headers: {
                    'Authorization': 'Basic ' + authdata
                },
                withCredentials: true
                });
            var raspicamLogin = $http.get('/camera/index.html', {
                headers: {
                    'Authorization': 'Basic ' + authdata
                },
                withCredentials: true
                });

            $q.all([webiopiLogin, raspicamLogin])
                .then(loginSuccess, loginFail);

            function loginSuccess() {
                console.log('success!');
                service.setCredentials(username, password);
                callback({ success: true });
            }

            function loginFail() {
                console.log('fail!');
                callback({ success: false, message: "Could not authenticate with the GaragePi" });
            };
        }

        function setCredentials(username, password) {
            var authdata = base64.encode(username + ':' + password);
            $rootScope.authData = authdata;
            $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
            $cookies.put('x_authorization', authdata);
        }

        function clearCredentials() {
            delete $rootScope.authData;
            $cookies.remove('x_authorization');
            $http.defaults.headers.common.Authorization = 'Basic ';
        }
    }
})();
