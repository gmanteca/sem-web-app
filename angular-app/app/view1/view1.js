'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  })
  .when('/restaurant/:restId', {
    controller: 'RestaurantDetailController',
    templateUrl: 'view1/detail.html'
  });
}])

.controller('RestaurantDetailController',
            ['$scope','$routeParams','$location',function($scope,$routeParams,$location) {
    var restaurant = $routeParams.restId;

    restaurantList = this;
    
    var selectedRestaurant = null;

    restaurantList.restaurants.forEach(function(value){
        if (value['id'] == restaurant)
            selectedRestaurant = value;
    });

    

    $scope.goBack = function(){
        $location.path('/');
    }

}])

.controller('RestaurantController', ['$scope',function($scope) {
    restaurantList = this;
    restaurantList.restaurants = [];

}])

.controller('View1Ctrl', ['$scope','$http',function($scope,$http) {
    $scope.fetch = function(){
        console.log($scope.url);
        console.log($scope.consulta);
        $.ajax($scope.url).done(function(data){
            $scope.result = data;
        });

    //load data on sparql
    $http({method:'GET',url:'/sparql',params:{query:'select%20*%20where{%20<http://156.35.95.63/Restaurants>%20<http://schema.org/Restaurant>%20?r%20.%20?r%20?p%20?o%20.}',output:'json'}})
        .success(function(data,status){
            var list = data['results']['bindings'];
            list.forEach(function(value){
                //get card system
                switch(value['p']['value']){
                    case 'http://schema.org/review':
                        $scope.cards[value['r']['value']].review = value['o']['value'];
                        break;
                    //TODO rest
                }
                //$scope.cards[value['r']['value']];
            })
        })
        .error(function(data,status){
            alert('Error, posible backend caído?');
        })
    }
    $scope.url = 'http://156.35.98.21:3030';
}]);
