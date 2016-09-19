(function() {
    'use strict';

    angular
        .module('garagePi')
        .factory('gpioService', gpioService);

    gpioService.$inject = ['$http', '$interval'];

    function gpioService($http, $interval) {
        var observers = [];

        refreshGPIOs();
        $interval(refreshGPIOs, 1000);

        var service = {
            GPIOs: {},
            digitalWrite: digitalWrite,
            registerObserver: registerObserver
        };
        return service;

        function digitalWrite(gpio, value) {
            $http.post('/api/GPIO/' + gpio + '/value/' + value).success(function() {
                service.GPIOs[gpio] = value;
            });
        }

        function registerObserver(observer) {
            observers.push(observer);
        }

        function notifyObservers() {
            angular.forEach(observers, function(observer) {
                observer();
            });
        }

        function refreshGPIOs() {
            $http.get('/api/*').success(function(response) {
                angular.forEach(response['GPIO'], function(data, gpio) {
                    service.GPIOs[gpio] = data['value'];
                });
                notifyObservers();
            });
        }
    }
})();
