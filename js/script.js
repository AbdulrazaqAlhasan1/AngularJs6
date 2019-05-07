var app = angular.module("myApp", ["ngRoute", "ngCookies"])
app.config(function ($routeProvider) {
    $routeProvider

        .when("/", {
            templateUrl: "view/horizontal.html",
            controller: "horizontalController"
        })

        .when("/horizontal", {
            templateUrl: "view/horizontal.html",
            controller: "horizontalController"
        })

        .when("/login", {
            templateUrl: "view/login.html",
            controller: "loginController",
            controllerAs: "vm"
        })

        .when("/register", {
            templateUrl: "view/register.html",
            controller: "registerController",
            controllerAs: "vm"
        })

        .when("/vertical", {
            templateUrl: "view/vertical.html",
            controller: "verticalController"
        })

        .when("/home", {
            templateUrl: "view/home.html",
            controller: "homeController",
            controllerAs: "vm"
        })
});

// Login Controller
app.controller("loginController", function ($location, authService, dialogService) { 
    var vm = this;

    function login() {
        vm.dataLoading = true;

        authService.Login(vm.email, vm.password) 
            .then(function (res) {
                if(res.success) {
                    authService.SetCredentials(res.id, res.token);
                    $location.path("/home");
                } else {
                    dialogService.Error(res.message);
                    vm.dataLoading = false;
                }
            })               
    }

    (function initController() {
        authService.ClearCredentials();
    })();

    vm.login = login;
});


// Register Controller
app.controller("registerController", function (userService, $location, $rootScope, dialogService) { 

    var vm = this;

    vm.register = function () {
        vm.dataLoading = true;
        userService.Create(vm.user)
            .then(function (res) {
                if(res.success) {
                    dialogService.Success("Registration was successful", true);
                    $location.path("/login");
                } else {
                    dialogService.Error(res.message);
                    vm.dataLoading = false;
                }
            })
    }
});


// Horizontal Controller
app.controller("horizontalController", function ($rootScope, $http) {

    const starsTotal = 5;

    $http.get("http://localhost:3001/api/products").then((res) => $rootScope.products = res.data);

    $rootScope.rating = function (input) {
        return `${Math.round(((input / starsTotal) * 100) / 10) * 10}%`;
    }
    $rootScope.cart = [];
    $rootScope.emptycart = "";

    var getProductId = function (products, id) {
        return _.find(products, function (product) {
            return product.id === id
        });
    };

    $rootScope.addItem = function (product) {
        var found = getProductId($rootScope.cart, product.id);

        if (found) {
            found.quantity += product.quantity;
        }
        else {
            $rootScope.cart.push(angular.copy(product));
        }
    }

    $rootScope.removeItem = function (product) {
        var index = $rootScope.cart.indexOf(product);
        $rootScope.cart.splice(index, 1);
    }

    $rootScope.getProductCost = function (product) {
        return product.quantity * product.price;
    }

    $rootScope.getProductQuantity = function (product) {
        return product.quantity;
    }

    $rootScope.getTotal = function () {
        var total = _.reduce($rootScope.cart, function (sum, product) {
            return sum + $rootScope.getProductCost(product);
        }, 0);

        if ($rootScope.cart.length === 0) {
            $rootScope.emptycart = "Your cart is empty."
        }
        else {
            $rootScope.emptycart = ""
        }
        return total;
    }

    $rootScope.getQuantity = function () {
        var quantity = _.reduce($rootScope.cart, function (sum, product) {
            return sum + $rootScope.getProductQuantity(product);
        }, 0);

        if (quantity === 0) {
            $rootScope.badgeColor = "badge-secondary"
        } else {
            $rootScope.badgeColor = "badge-danger"
        }


        return quantity;
    }

})




// Vertical Controller
app.controller("verticalController", function ($rootScope, $http) {


    // ratings
    const starsTotal = 5;

    $http.get("http://localhost:3001/api/products").then((res) => $rootScope.products = res.data);

    $rootScope.rating = function (input) {
        return `${Math.round(((input / starsTotal) * 100) / 10) * 10}%`;
    }

    // Scroll function
    $(window).scroll(function () {
        let topPosition = $(this).scrollTop();

        if (topPosition > 100) {
            $(".scrollTop").css("opacity", "1");
        } else {
            $(".scrollTop").css("opacity", "0");
        }
    })


    $rootScope.cart = [];
    $rootScope.emptycart = "";

    var getProductId = function (products, id) {
        return _.find(products, function (product) {
            return product.id === id
        });
    };

    $rootScope.addItem = function (product) {
        var found = getProductId($rootScope.cart, product.id);

        if (found) {
            found.quantity += product.quantity;
        }
        else {
            $rootScope.cart.push(angular.copy(product));
        }
    }

    $rootScope.removeItem = function (product) {
        var index = $rootScope.cart.indexOf(product);
        $rootScope.cart.splice(index, 1);
    }

    $rootScope.getProductCost = function (product) {
        return product.quantity * product.price;
    }

    $rootScope.getProductQuantity = function (product) {
        return product.quantity;
    }

    $rootScope.getTotal = function () {
        var total = _.reduce($rootScope.cart, function (sum, product) {
            return sum + $rootScope.getProductCost(product);
        }, 0);

        if ($rootScope.cart.length === 0) {
            $rootScope.emptycart = "Your cart is empty."
        }
        else {
            $rootScope.emptycart = ""
        }
        return total;
    }

    $rootScope.getQuantity = function () {
        var quantity = _.reduce($rootScope.cart, function (sum, product) {
            return sum + $rootScope.getProductQuantity(product);
        }, 0);

        if (quantity === 0) {
            $rootScope.badgeColor = "badge-secondary"
        } else {
            $rootScope.badgeColor = "badge-danger"
        }


        return quantity;
    }

})


// home Controller
app.controller("homeController", function (userService, $rootScope) { 
    var vm = this;
    vm.user = null;
    vm.allUsers = [];

    function getCurrentUser(id) {
        userService.GetUser(id)
            .then(function (user) {
                vm.user = user;             
            })      
    }

    function getAllUsers() {
        userService.GetUsers()
            .then(function (users) {
                vm.allUsers = users
            })
    }

    function deleteUser(id) {
        userService.Delete(id)
            .then(function () {
                getAllUsers();
            })
    }

    function initController() {
        getCurrentUser($rootScope.globals.currentUser.id);
        getAllUsers();
    }


    initController();
    vm.deleteUser = deleteUser;
});