(function() {

    angular
        .module("myApp")
        .factory("authService", authService);

    authService.$inject = ['$http', "$cookies", "$rootScope", "$timeout", "userService"];
    function authService($http, $cookies, $rootScope, $timeout, userService) {
        var service = {}

        function handleResponse(res) {
            return res.data;
        }

        function Login(email, password) {
            return $http
                .post("http://localhost:3001/api/users/login", { email: email, password: password})
                .then(handleResponse, handleResponse)
        }

        function SetCredentials(id, token) {

            $rootScope.globals = {
                currentUser: {
                    id: id,
                    token: token
                }
            }

            console.log($rootScope.globals)

            $http.defaults.headers.common["Authorization"] = "Bearer " + token;

            var cookieExp = new Date();
            cookieExp.setTime(cookieExp.getTime() + (60*60*1000));

            $cookies.putObject("globals", $rootScope.globals, { expires: cookieExp });

        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove("globals");
            $http.defaults.headers.common.Authorization = "Bearer";
        }

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;
    }

})();