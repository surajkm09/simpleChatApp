

var app = angular.module("main-application", []);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    templateUrl: "/views/main.html",
    controller: "maincontroller"
  });

  $routeProvider.when("/chat",{
    templateUrl:"/views/chat.html" , 
    controller:"chatcontroller"
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



app.factory("webSocket",function(){
  var webSocket ;
  return {
    get : function(){
      return webSocket ; 
    }
    ,
    set : function(websocket){
      webSocket = websocket 
    }
    
  }
})
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
app.controller("chatcontroller",function($scope,webSocket){
    if(localStorage.getItem('userName')===null)
    {
      $scope.error =" An error Has occurred"
      return ; 
    }
    $scope.messages = [] ; 

    $scope.socket = webSocket.get();
    $scope.socket.on('message-receive',function(data){
      $scope.$apply(function(){
        console.log("message received is ")
        console.log(data)
        $scope.messages.push(data);
      })
    });
    console.log($scope.socket)
    $scope.responeMessage =""; 
    $scope.onSend = function()
    {
      data={};
      data.userName = localStorage.getItem('userName');
      data.message = $scope.responeMessage;
      $scope.messages.push($scope.responeMessage) 
      $scope.socket.emit('message-send',JSON.stringify(data));
      $scope.responeMessage="";
    }
    $scope.userName = localStorage.getItem('userName')




})
app.controller("profilecontroller", function($scope, backEndService,$location,webSocket) {
  console.log("inside profile controller");
  if (localStorage.getItem("token") === null) {
    $scope.error = " Token not set !!";
    return;
  }
  $scope.users = [];
  $scope.token = JSON.parse(localStorage.getItem("token"));
  $scope.socket = backEndService.getWebSocket($scope.token);
  webSocket.set($scope.socket);
  //localStorage.setItem('webSocket',JSON.stringify($scope.socket))
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
  $scope.onUserClick=function(user){
    console.log(user)
    localStorage.setItem('userName',user);
    $location.path('/chat');

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
