var app = angular.module("main-application", []);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    templateUrl: "/views/main.html",
    controller: "maincontroller"
  });

  $routeProvider.when("/login", {
    templateUrl: "/views/login.html",
    controller: "logincontroller"
  });

  $routeProvider.when("/register", {
    templateUrl: "/views/signup.html",
    controller: "signupcontroller"
  });
  $routeProvider.when("/profile", {
    templateUrl: "/views/profile.html",
    controller: "profilecontroller"
  });
  $locationProvider.html5Mode(true);
});

app.factory("generateBackendURL", function() {
  return function(functionality) {
    var url = "http://localhost:3333";
    switch (functionality) {
      case "login":
        url += "/api" + "/user" + "/login";
        return url;
      case "signup":
        url += "/api" + "/user" + "/signup";
        return url;
      case "websocket":
        return url;
      default:
        return null;
    }
  };
});

app.factory("backEndService", function($http, generateBackendURL) {
  return {
    login: function(user) {
      data = {
        user: user
      };
      console.log(generateBackendURL("login"));
      return $http.post(generateBackendURL("login"), data);
    },
    signup: function(user) {
      data = {
        user: user
      };
      console.log(generateBackendURL("signup"));
      return $http.post(generateBackendURL("signup"), data);
    },
    getWebSocket: function(token) {
      var socket = io.connect(generateBackendURL("websocket"), {
        query: "token=" + token.token
      });
      console.log(socket);
      return socket;
    },
    getOnlineUsers: function(socket) {
      socket.emit("getOnlineUsers");
    }
  };
});
app.controller("profilecontroller", function($scope, backEndService,$location) {
  console.log("inside profile controller");
  if (localStorage.getItem("token") === null) {
    $scope.error = " Token not set !!";
    return;
  }
  $scope.users = [];
  $scope.token = JSON.parse(localStorage.getItem("token"));
  $scope.socket = backEndService.getWebSocket($scope.token);
  //var selfScope = $scope;
  $scope.socket.on("onlineUsers", function(data) {
      console.log('inside onlineUsers');
    $scope.$apply(function() {
        $scope.users = JSON.parse(data);
        
       });
  });
  $scope.onLogout = function(){
      $scope.socket.emit('logout');
      $location.path('/login')
  }
});

app.controller("signupcontroller", function($scope, backEndService) {
  $scope.user = {};
  $scope.onRegister = function() {
    if (
      $scope.firstName === "" ||
      $scope.lastName === "" ||
      $scope.userName === "" ||
      $scope.password === ""
    ) {
      return;
    } else {
      backEndService
        .signup($scope.user)
        .success(data => {
          console.log("succeful");
        })
        .error(error => {
          console.log(error);
        });
    }
  };
});

app.controller("logincontroller", function($scope, backEndService, $location) {
  $scope.user = {};
  $scope.onLogin = function() {
    if ($scope.user.userName === "" || $scope.user.password === "") {
      return;
    } else {
      backEndService
        .login($scope.user)
        .success(data => {
          console.log(data);
          data = JSON.stringify(data);
          localStorage.setItem("token", data);
          console.log(localStorage.getItem("token"));
          $location.path("/profile");
        })
        .error(error => {
          console.log(error);
        });
    }
  };
});

app.controller("maincontroller", function($scope) {});
