(function() {
    'use strict';

    angular
        .module('garagePi')
        .run(runBlock);

    runBlock.$inject = ['authenticationService'];

    function runBlock(authenticationService) {
        authenticationService.initialize();
    }
})();
