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

            authenticationService
                .login(vm.username, vm.password)
                .then(loginSuccess, loginFail);

            function loginSuccess() {
                $location.path('/');
            }

            function loginFail() {
                vm.error = 'Could not authenticate with the GaragePi';
                vm.dataLoading = false;
            }
        }
    }

})();
