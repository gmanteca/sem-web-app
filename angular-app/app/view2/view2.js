'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','$http',function($scope,$http) {
    $scope.classify = function(){
        $.ajax({async:false,method:'POST',url:'http://156.35.95.63:8888/classify',data:JSON.stringify({text:$scope.twitText})}).
            done(function(data,status){
                $scope.show=true;
                $scope.gender=data.value;
                $scope.trust=data.trust;
                $scope.twitResult=data;
        });
    };
}]);
