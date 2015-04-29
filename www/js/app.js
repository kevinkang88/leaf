// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('starter', ['ionic','firebase'])

var fb = null;

myApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    fb = new Firebase("http://leafmusicapp.firebaseIO.com/")
  });
})

myApp.config(function($stateProvider,$urlRouterProvider){

  $stateProvider
    .state("login",{
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginController"
    })
    .state("rooms",{
      url: "/rooms",
      templateUrl: "templates/rooms.html",
      controller: "RoomsController"
    });
    $urlRouterProvider.otherwise("/login")
});

myApp.controller("LoginController",function($scope,$firebaseAuth,$location){
  $scope.login = function(username,password){
    var fbAuth = $firebaseAuth(fb);
    fbAuth.$authWithPassword({
      email: username,
      password: password
    }).then(function(authData){
      $location.path("/rooms");
    }).catch(function(error){
      alert("ERROR: " + error);
    });
  }

  $scope.register = function(username,password){
      var fbAuth = $firebaseAuth(fb);
      fbAuth.$createUser({email: username,password: password}).then(function(){
          return fbAuth.$authWithPassword({
            email: username,
            password: password
          });
        $location.path("/rooms")
      }).catch(function(error){
        alert("ERROR: " + error);
      })
  }
});

myApp.controller("RoomsController",function($scope,$firebaseObject,$ionicPopup){
   $scope.list = function(){
  var fbAuth = fb.getAuth();
    if(fbAuth){
      var obj = $firebaseObject(fb.child("users/" + fbAuth.uid));
      obj.$bindTo($scope,"data");
    }
   }

   $scope.create = function(){
    $ionicPopup.prompt({
      title: "Enter a new room name",
      inputType: "text"
    }).then(function(result){
      if(result != ""){
        if($scope.data.hasOwnProperty("todos") !== true){
          $scope.data.todos = [];
        }
        $scope.data.todos.push({title:result});
      }
    });
   }
})