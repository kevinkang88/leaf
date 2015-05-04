angular.module('starter.services', [])

.service('LeafApi',function($http){

  var headers = {
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  return {
    getAccess: function() {
      return $http.get('https://hidden-wildwood-9605.herokuapp.com/api/leaf_api/assign_key')
        .then(function(result){
          console.log(result) ;
          console.log(result.data) ;
          return result.data ; 
        });
    }
  }

});
