(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = ['$http', '$rootScope', '$q', '$location'];

    function authenticationService($http, $rootScope, $q, $location) {
        var service = {
            initialize: initialize,
            relogin: relogin,
            login: login,
            logout: logout
        };
        return service;

        var session = false;
        var user;

        function initialize() {
            return $http.get('/session')
                .then(success, fail)
                .then(routeProtect);

            function success() {
                session = true;
            }

            function fail() {
                session = false;
            }

            function routeProtect() {
                $rootScope.$on("$routeChangeStart", function(event, next, current) {
                    if ($location.path() !== '/login' && !session) {
                        event.preventDefault();
                        $location.path('/login');
                    }
                });
            }
        }

        function relogin() {
            if (!user) {
                session = false;
                return $q.reject();
            }

            return login(user.username, user.password);
        }

        function login(username, password) {
            return $http.post('/session', {
                username: username,
                password: password
            }).then(loginSuccess, loginFail);

            function loginSuccess() {
                session = true;
                user = {
                    username: username,
                    password: password
                };
            }

            function loginFail() {
                session = false;
                user = undefined;
                return $q.reject();
            };
        }

        function logout() {
            session = false;
            user = undefined;
            return $http.delete('/session');
        }
    }
})();
