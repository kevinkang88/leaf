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
    })
    .state("room",{
      url: "/rooms/:roomId",
      templateUrl: "templates/room.html",
      controller: "RoomController"
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

myApp.controller("RoomsController",function($scope,$firebaseObject,$ionicPopup,$location,$scope,$stateParams){
  $scope.list = function(){
    var fbAuth = fb.getAuth();
    if(fbAuth){
      // below is to select individual users
      var objIdx = $firebaseObject(fb.child("users/"));
      var objShow = $firebaseObject(fb.child("users/" + fbAuth.uid));
      objIdx.$bindTo($scope,"data");
      objShow.$bindTo($scope,"dataShow");
    }
  }

  $scope.create = function(){
    var fbAuth = fb.getAuth();

    $ionicPopup.prompt({
      title: "Enter a new room name",
      inputType: "text"
    }).then(function(result){
      if(result != ""){
        if($scope.dataShow.hasOwnProperty("rooms") !== true){
          $scope.dataShow.rooms = [];
        }
        $scope.dataShow.rooms.push({title: result, uid: fbAuth.uid + "_" + result + "_" + $scope.dataShow.rooms.length });
      }
    });
   }

   $scope.enterRoom = function(roomId){
    $location.path("/rooms/" + roomId);
    // $state.go('/rooms/:roomId',{roomId: roomId});
   }
});

myApp.controller("RoomController",function($scope,$firebaseObject,$ionicPopup,$location,$scope,$stateParams){
    $scope.listTracks = function(){      
      var params    = location.hash.substr(8).split("_") ; 
      var userUid   = params[0] ; 
      var roomTitle = params[1] ;
      var roomIdx   = params[2] ;
      var fbAuth = fb.getAuth(); 
      if (fbAuth){
        var objShow = $firebaseObject(fb.child("users/" + userUid + "/rooms/" + roomIdx));
        objShow.$bindTo($scope,"roomNode");
      }
    }
    $scope.setRoomTitle = function(){
      var params    = location.hash.substr(8).split("_") ; 
      var roomTitle = params[1] ;
      return roomTitle
    }
});