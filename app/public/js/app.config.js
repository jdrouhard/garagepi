(function() {
    'use strict';

    angular
        .module('garagePi')
        .config(configBlock);

    configBlock.$inject = ['$httpProvider'];

    function configBlock($httpProvider) {
        $httpProvider.interceptors.push('sessionHttpInterceptor');
    }

})();
