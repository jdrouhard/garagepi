angular.module('garagePi')
    .controller('LoginController', ['$scope', '$rootScope', '$location', 'AuthenticationService',
        function($scope, $rootScope, $location, AuthenticationService) {
            AuthenticationService.ClearCredentials();

            $scope.login = function() {
                $scope.dataLoading = true;
                AuthenticationService.Login($scope.username, $scope.password, function(response) {
                    if (response.success) {
                        $location.path('/');
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                });
            };

        }])

    //.directive('streamTest', ['$rootScope', '$location', '$sce', '$timeout', function($rootScope, $location, $sce, $timeout) {
        //return {
            //restrict: 'A',
            //scope: {
                //url: '@'
            //},
            //replace: true,
            //template: '<div><iframe ng-src="{{authUrl}}" style="display: none;"></iframe><img ng-src="{{streamUrl}}" class="img-responsive center-block"></img></div>',
            //link: function(scope, elem) {
                //var user = $rootScope.globals.currentUser.username;
                //var password = $rootScope.globals.currentUser.password;
                //var hostname = $location.host();

                //scope.authUrl = $sce.trustAsResourceUrl('http://' + user + ':' + password + '@' + hostname + scope.url);
                //scope.streamUrl = '';
                //$timeout(function() {
                    //scope.streamUrl = $sce.trustAsResourceUrl('http://' + hostname + scope.url);
                    //scope.authUrl = '/camera/index.html';
                    //scope.$apply();
                //}, 50);

            //}
        //}
    //}])

    .directive('stream', ['WebcamService', function(WebcamService) {
        return {
            restrict: 'A',
            scope: {
                url: '@'
            },
            replace: true,
            template: '<img ng-src="{{url}}" class="img-responsive center-block"></img>',
            link: function(scope, elem) {
                scope.url = '';
                var getCurrentImage = function() {
                    WebcamService.getImageBlob(scope.url, function(imageUrl) {
                        scope.url = imageUrl;
                        elem.bind('load', function() {
                            WebcamService.releaseImageBlob(imageUrl);
                        });
                        getCurrentImage();
                    });
                };

                getCurrentImage();

            }
        }
    }])

    .directive('gpioButton', ['GPIOService', function(GPIOService) {
        return {
            restrict: 'A',
            scope: {
                gpio: '@',
            },
            transclude: true,
            replace: true,
            template: '<div style="padding-top: 5px;"><button class="btn btn-lg btn-block" ng-class="val==1 ? \'btn-primary active\' : \'btn-default -active\'"><ng-transclude></ng-transclude></button></div>',
            link: function(scope, elem, attrs) {
                var isTouchDevice = "ontouchstart" in document.documentElement ? true : false;
                var BUTTON_DOWN = isTouchDevice ? "touchstart" : "mousedown";
                var BUTTON_UP = isTouchDevice ? "touchend" : "mouseup";

                scope.val = GPIOService.GPIOs[scope.gpio] || 0;

                function mousedown() {
                    //console.log('mousedown');
                    scope.val = 1;
                    GPIOService.digitalWrite(scope.gpio, '1');
                };

                function mouseup() {
                    //console.log('mouseup');
                    scope.val = 0;
                    GPIOService.digitalWrite(scope.gpio, '0');
                };

                function toggle() {
                    //console.log('toggle');
                    if (scope.val == 0) scope.val = 1;
                    else if (scope.val == 1) scope.val = 0;
                    GPIOService.digitalWrite(scope.gpio, scope.val);
                };

                if (attrs.toggle !== undefined) {
                    elem.bind(BUTTON_DOWN, toggle);
                }
                else {
                    //console.log('toggle is true for ' + scope.gpio);
                    elem.bind(BUTTON_UP, mouseup);
                    elem.bind(BUTTON_DOWN, mousedown);
                }

                scope.$watch(function() {
                    return GPIOService.GPIOs[scope.gpio];
                }, function(newVal) {
                    scope.val = newVal;
                });

            }
        };
    }]);
