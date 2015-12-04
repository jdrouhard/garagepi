angular.module('garagePi')
    .factory('AuthenticationService', ['Base64', '$http', '$cookies', '$rootScope', '$timeout', '$q',
            function(Base64, $http, $cookies, $rootScope, $timeout, $q) {
                var service = {};

                service.Login = function(username, password, callback) {
                    var authdata = Base64.encode(username + ':' + password);
                    var webiopiLogin = $http.get('/api/*', {
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        },
                        withCredentials: true
                        });
                    var raspicamLogin = $http.get('/camera/index.html', {
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        },
                        withCredentials: true
                        });

                    $q.all([webiopiLogin, raspicamLogin]).then(function() {
                            console.log('success!');
                            service.SetCredentials(username, password);
                            callback({ success: true });
                        }, function() {
                            console.log('fail!');
                            callback({ success: false, message: "Could not authenticate with the GaragePi" });
                        });
                };

                service.SetCredentials = function(username, password) {
                    var authdata = Base64.encode(username + ':' + password);
                    $rootScope.authData = authdata;
                    $http.defaults.headers.common.Authorization = 'Basic ' + authdata;
                    $cookies.put('x_authorization', authdata);
                };

                service.ClearCredentials = function() {
                    delete $rootScope.authData;
                    $cookies.remove('x_authorization');
                    $http.defaults.headers.common.Authorization = 'Basic ';
                };

                return service;
            }
    ])

    //.factory('WebcamService', ['$http', '$timeout', function($http, $timeout) {
        //var webcamService = {};
        //var urlCreator = window.URL || window.webkitURL;

        //webcamService.releaseImageBlob = function(imageUrl) {
            //urlCreator.revokeObjectURL(imageUrl);
        //};

        //webcamService.getImageBlob = function(imageUrl, callback) {
            //$http.get('/camera/?action=snapshot', {responseType: 'arraybuffer'})
                //.success(function(result) {
                    //var arrayBuffer = new Uint8Array(result);
                    //var blob = new Blob([arrayBuffer], { type: 'image/jpeg' } );
                    //var imageUrl = urlCreator.createObjectURL(blob);
                    //arrayBuffer = blob = null;
                    //if (callback) {
                        //callback(imageUrl);
                    //}
                    //imageUrl = null;
                //});
        //};

        //return webcamService;
    //}])

    .factory('GPIOService', ['$http', '$timeout', function($http, $timeout) {
        var gpioService = {};

        gpioService.GPIOs = {};

        gpioService.digitalWrite = function(gpio, value, callback) {
            $http.post('/api/GPIO/' + gpio + '/value/' + value).success(function() {
                gpioService.GPIOs[gpio] = value;
            });
        };

        gpioService.refreshGPIO = function(callback) {
            $http.get('/api/*').success(function(response) {
                angular.forEach(response['GPIO'], function(data, gpio) {
                    gpioService.GPIOs[gpio] = data['value'];
                });
                if (callback) {
                    callback();
                }
            });
        };

        function updateVals() {
            gpioService.refreshGPIO(function() {
                $timeout(updateVals, 1000);
            });
        };

        updateVals();

        return gpioService;
    }])

    .factory('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    });
