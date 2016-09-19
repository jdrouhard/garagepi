(function() {
    'use strict';

    angular
        .module('garagePi')
        .component('gpioButton', gpioButtonOptions);

    var gpioButtonOptions = {
        bindings: {
            gpio: '@',
        },
        transclude: true,
        template: '<div style="padding-top: 5px;">' +
                      '<button class="btn btn-lg btn-block" ng-class="$ctrl.val==1 ? \'btn-primary active\' : \'btn-default -active\'">' +
                          '<ng-transclude></ng-transclude>' +
                      '</button>' +
                  '</div>',
        controller: GpioController
    };


    GpioController.$inject = ['gpioService', '$element'];

    function GpioController(gpioService, $element) {
        var BUTTON_DOWN = 'mousedown touchstart';
        var BUTTON_UP = 'mouseup touchend';

        var vm = this;
        vm.$onInit = init;
        vm.$onDestroy = destroy;

        function init() {
            vm.val = gpioService.GPIOs[vm.gpio] || 0;

            if ($element.attr('toggle') !== undefined) {
                $element.on(BUTTON_DOWN, toggle);
            }
            else {
                $element.on(BUTTON_DOWN, mousedown);
                $element.on(BUTTON_UP, mouseup);
            }

            gpioService.registerObserver(updateVal);
        }

        function destroy() {
            $element.off(BUTTON_DOWN + ' ' + BUTTON_UP);
        }

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
    }
})();
