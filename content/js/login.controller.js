(function() {
    'use strict';

    angular
        .module('garagePi')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'authenticationService'];

    function LoginController($location, authenticationService) {
        var vm = this;
        vm.dataLoading = false;
        vm.login = login;

        authenticationService.clearCredentials();

        function login() {
            vm.dataLoading = true;

            authenticationService.login(vm.username, vm.password, loginCallback);

            function loginCallback(response) {
                if (response.success) {
                    $location.path('/');
                }
                else {
                    vm.error = response.message;
                    vm.dataLoading = false;
                }
            }
        }
    }

})();
