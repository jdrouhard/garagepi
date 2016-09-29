(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('sessionHttpInterceptor', sessionHttpInterceptor);

    sessionHttpInterceptor.$inject = ['$q', '$injector'];

    function sessionHttpInterceptor($q, $injector) {
        var service = {
            responseError: onResponseError
        };
        return service;

        function onResponseError(response) {
            if (response.status == 401) { // UNAUTHORIZED
                var $http = $injector.get('$http');
                var $location = $injector.get('$location');
                var authenticationService = $injector.get('authenticationService');

                return authenticationService.relogin()
                    .then(tryAgain, loginFailed);

                function tryAgain() {
                    return $http(response.config);
                }

                function loginFailed() {
                    $location.path('/login');
                    return $q.reject(response);
                }
            }

            return $q.reject(response);
        }
    }

})();

