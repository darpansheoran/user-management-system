var app = angular.module("myApp", ["ui.router", "ng-fusioncharts"]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/login");
    $urlRouterProvider.when("/home", "/home/" + "datalist");

    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "login/login.html",
        controller: "LoginController",
      })
      .state("register", {
        url: "/register",
        templateUrl: "register/register.html",
        controller: "RegisterController",
      })
      .state("home", {
        url: "/home",
        templateUrl: "home/home.html",
        controller: "homeController",
      })
      .state("home.dataList", {
        url: "/datalist",
        templateUrl: "home/dataList.html",
        controller: "dataListController",
      })
      .state("home.charts", {
        url: "/charts",
        templateUrl: "home/charts.html",
        controller: "chartsController",
      });
  },
]);

app.factory("LoginService", function () {
  var users = [{ username: "admin", password: "pass" }];
  var isAuthenticated = false;
  var currentUser = null;

  return {
    login: function (username, password) {
      isAuthenticated = false;
      users.forEach((user) => {
        if (user.username == username && user.password == password) {
          isAuthenticated = true;
          currentUser = user;
        }
      });
      return isAuthenticated;
    },
    addUser: function (user) {
      users.push(user);
    },
    checkUsername: function (username) {
      let tmp = true;
      users.forEach((user) => {
        if (user.username.toLowerCase() == username.toLowerCase()) {
          tmp = false;
        }
      });

      return tmp;
    },
    getCurrentUser: function () {
      return currentUser;
    },
  };
});

app.factory("FlashService", function () {
  var flash = null;
  return {
    setSuccessMessage: function (msg) {
      flash = { type: "success", message: msg };
    },

    resetFlash: function () {
      flash = null;
    },

    getFlash: function () {
      return flash;
    },
  };
});

app.factory("randomUser", function apiService($http) {
  return {
    getData: function () {
      return $http.get("https://randomuser.me/api/?results=100");
    },
  };
});
