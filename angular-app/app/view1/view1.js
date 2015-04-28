'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','$http',function($scope,$http) {
    $scope.fetch = function(){
        console.log($scope.url);
        console.log($scope.consulta);
        $.ajax($scope.url).done(function(data){
            $scope.result = data;
        });
/*        $http({method:'GET',url:$scope.url ,params:{query:$scope.consulta, output:'json'}}).success(function (data,status){
            console.log("data: "+data);
            console.log("status: "+status);
            $scope.result = data;
        }).error(function(data,status){
            console.log("Request failed");
            console.log(data);
            console.log(status);
        });*/
    }
    $scope.url = 'http://156.35.98.21:3030';
}]);
