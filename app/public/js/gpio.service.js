(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('gpioService', gpioService);

    gpioService.$inject = ['$http', '$timeout'];

    function gpioService($http, $timeout) {
        var observers = [];
        var stopRefresh;

        var service = {
            GPIOs: {},
            digitalWrite: digitalWrite,
            registerObserver: registerObserver,
            unregisterObserver: unregisterObserver
        };
        return service;

        function digitalWrite(gpio, value) {
            $http.post('/api/GPIO/' + gpio + '/value/' + value).then(setValue);

            function setValue() {
                service.GPIOs[gpio] = value;
            }
        }

        function registerObserver(observer) {
            observers.push(observer);
            if (observers.length == 1) {
                refreshGPIOs();
            }
        }

        function unregisterObserver(observer) {
            var it = observers.indexOf(observer);
            if (it != -1) {
                observers.splice(it, 1);
            }
            if (observers.length == 0 && angular.isDefined(stopRefresh)) {
                $timeout.cancel(stopRefresh);
                stopRefresh = undefined;
            }
        }

        function notifyObservers() {
            angular.forEach(observers, function(observer) {
                observer();
            });
        }

        function refreshGPIOs() {
            $http.get('/api/*').then(parseResponse);

            function parseResponse(response) {
                angular.forEach(response.data['GPIO'], function(data, gpio) {
                    service.GPIOs[gpio] = data['value'];
                });
                notifyObservers();
                if (observers.length > 0) {
                    stopRefresh = $timeout(refreshGPIOs, 1000);
                }
            }
        }
    }
})();
