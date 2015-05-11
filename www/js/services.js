angular.module('starter.services', [])

.service('LeafApi',function($http){

  return {
    getAccess: function() {
      return $http.get('https://hidden-wildwood-9605.herokuapp.com/api/leaf_api/assign_key')
        .then(function(result){
          console.log(result) ;
          console.log(result.data) ;
          return result.data ; 
        });
    },
    searchSC: function(query,token) {
      return $.getJSON('https://hidden-wildwood-9605.herokuapp.com/api/soundcloud/search',{
        headers: {Authorization: "Token token=\'" + token + "\'"}
      })
        .then(function(result){
          console.log(result) ; 
          console.log(result.data) ; 
          return result.data ; 
        })
    }
  }

});
