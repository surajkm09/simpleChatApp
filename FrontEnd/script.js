var app = angular.module('main-application',[]);



app.config(function($routeProvider,$locationProvider){
    $routeProvider.when('/',{
        templateUrl:'/views/main.html',
        controller:'maincontroller'
    })

    $routeProvider.when('/login',{
        templateUrl:'/views/login.html',
        controller :'logincontroller'
    });

    $routeProvider.when('/register',{
        templateUrl:'/views/signup.html',
        controller:'signupcontroller'
    });
    $locationProvider.html5Mode(true);


});

app.factory('generateBackendURL',function(){
    return function(functionality){
        var url = 'https://localhost:3000';
        switch(functionality){
            case 'login': url += '/api'+'/user'+'/login'; 
                          return url ; 
            case 'signup': url += '/api'+'/user'+'/signup' ; 
                            return url ; 
            default:
                    return null ; 
            
        }

    }
});


app.factory('backEndService',function($http,generateBackendURL){
    return {
        login : function(user){

            data = { 
                user :user
            };
            console.log(generateBackendURL('login'))
            console.log(data)
            return  $http.post(generateBackendURL('login'),data)
        },
        signup: function(user){

            data = { 
                user:user
            }
            console.log(generateBackendURL('signup'));
            console.log(data);
            

            return $http.post(generateBackendURL('signup'),data)

        }
    }
});

app.controller('signupcontroller',function($scope,backEndService){
    $scope.user={};
    $scope.onRegister = function(){
        if( $scope.firstName === '' ||$scope.lastName === '' || $scope.userName === '' || $scope.password === '')
        {
            return ;
        }
        else 
        {
            backEndService.signup($scope.user).success((data)=>{
                console.log('succeful');
                
            }).error((error)=>{
                console.log(error)
            });
        }

    };
})

app.controller('logincontroller',function($scope,backEndService,$location){
    $scope.user ={} ; 
    $scope.onLogin=function(){

        if($scope.user.userName === ''||$scope.user.password===''){
            return ; 
        }
        else{
            backEndService.login($scope.user).success((data)=>{
                console.log('The call was successful!!');

            }).error((error)=>{
                console.log(error);
                
            });

        }

    };
})

app.controller('maincontroller',function($scope){
});