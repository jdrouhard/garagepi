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

.run(['$rootScope', '$location', '$cookieStore', '$http', function($rootScope, $location, $cookieStore, $http) {
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
        $http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
        }
    });
}]);

