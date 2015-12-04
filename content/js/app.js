angular.module('garagePi', [
        'ngRoute',
        'ngCookies',
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/home.html'
            //controller: 'MainController'
        })
        .when('/login', {
            templateUrl: '/partials/login.html',
            controller: 'LoginController'
        })
        .otherwise({
            redirectTo: '/login/'
        });
}])

.run(['$rootScope', '$location', '$cookies', '$http', function($rootScope, $location, $cookies, $http) {
    $rootScope.authData = $cookies.get('x_authorization');
    if ($rootScope.authData) {
        $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.authData;
    }

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if ($location.path() !== '/login' && !$rootScope.authData) {
            $location.path('/login');
        }
    });
}]);

