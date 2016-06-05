(function() {
    'use strict';

    angular
        .module('garagePi')
        .directive('gpioButton', gpioButton);

    function gpioButton() {
        var directive = {
            restrict: 'E',
            scope: {
                gpio: '=',
            },
            transclude: true,
            template: '<div style="padding-top: 5px;"><button class="btn btn-lg btn-block" ng-class="vm.val==1 ? \'btn-primary active\' : \'btn-default -active\'"><ng-transclude></ng-transclude></button></div>',
            link: link,
            controller: GpioController,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        function link(scope, elem, attrs, vm) {
            var isTouchDevice = "ontouchstart" in document.documentElement ? true : false;
            var BUTTON_DOWN = isTouchDevice ? "touchstart" : "mousedown";
            var BUTTON_UP = isTouchDevice ? "touchend" : "mouseup";

            if (attrs.toggle !== undefined) {
                elem.bind(BUTTON_DOWN, vm.toggle);
            }
            else {
                elem.bind(BUTTON_UP, vm.mouseup);
                elem.bind(BUTTON_DOWN, vm.mousedown);
            }
        }
    }

    GpioController.$inject = ['gpioService'];

    function GpioController(gpioService) {
        var vm = this;

        vm.val = gpioService.GPIOs[vm.gpio] || 0;
        vm.mousedown = mousedown;
        vm.mouseup = mouseup;
        vm.toggle = toggle;

        function mousedown() {
            vm.val = 1;
            gpioService.digitalWrite(vm.gpio, '1');
        }

        function mouseup() {
            vm.val = 0;
            gpioService.digitalWrite(vm.gpio, '0');
        }

        function toggle() {
            if (vm.val == 0) vm.val = 1;
            else if (vm.val == 1) vm.val = 0;
            gpioService.digitalWrite(vm.gpio, vm.val);
        }

        function updateVal() {
            vm.val = gpioService.GPIOs[vm.gpio];
        }

        gpioService.registerObserver(updateVal);
    }
})();
