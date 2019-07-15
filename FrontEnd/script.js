

var app = angular.module("main-application",['ngRoute','ngMaterial']);

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
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
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);


app.factory("Page",function(){
  var title ="main";
  return {
    title : ()=>{return  title } ,
    setTitle :(temptitle)=>{
      title =temptitle 
    }
  }
})
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
        query: "token=" + token.data.token
      });
      console.log(socket);
      return socket;
    },
    getOnlineUsers: function(socket) {
      socket.emit("getOnlineUsers");
    }
  };
});
app.controller("chatcontroller",function($scope,webSocket,Page){
    if(sessionStorage.getItem('userName')===null)
    {
      $scope.error =" An error Has occurred"
      return ; 
    }

    Page.setTitle(sessionStorage.getItem('userName')+' chat')
    $scope.messages = [] ; 

    $scope.socket = webSocket.get();
    $scope.socket.on('message-receive',function(data){
      $scope.$apply(function(){
        console.log("message received is ")
        console.log(data)
        $scope.messages.push(data);
      })
    });
    $scope.responeMessage =""; 
    $scope.onSend = function()
    {
      data={};
      data.userName = sessionStorage.getItem('userName');
      console.log("user Name sending Message to ")
      console.log(data.userName);
      
      data.message = $scope.responeMessage;
      $scope.messages.push($scope.responeMessage) 
      $scope.socket.emit('message-send',JSON.stringify(data));
      $scope.responeMessage="";
    }
    $scope.userName = sessionStorage.getItem('userName')




})
app.controller("profilecontroller", function($scope, backEndService,$location,webSocket,Page) {
  console.log("inside profile controller");
  Page.setTitle("Profile");
  if (sessionStorage.getItem("token") === null) {
    $scope.error = " Token not set !!";
    return;
  }
  $scope.users = [];
  $scope.token = JSON.parse(sessionStorage.getItem("token"));
  $scope.socket = backEndService.getWebSocket($scope.token);
  webSocket.set($scope.socket);
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
    sessionStorage.setItem('userName',user);
    console.log(sessionStorage.getItem('userName'));
    $location.path('/chat');

  }
});

app.controller("signupcontroller", function($scope, backEndService,Page) {
  $scope.user = {};
  Page.setTitle('signup')
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
        .then(data => {
          console.log("succeful");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
});

app.controller("logincontroller", function($scope, backEndService, $location,Page) {
  $scope.user = {};
  Page.setTitle('login')
  $scope.onLogin = function() {
    if ($scope.user.userName === "" || $scope.user.password === "") {
      return;
    } else {
      backEndService
        .login($scope.user)
        .then(data => {
          console.log(data);
          data = JSON.stringify(data);
          sessionStorage.setItem("token", data);
          console.log(sessionStorage.getItem("token"));
          $location.path("/profile");
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
});
app.controller("index-controller",function($scope ,Page){
  $scope.title = Page.title();

})
app.controller("maincontroller", function($scope,Page) {
  console.log(Page.title());
 
});
