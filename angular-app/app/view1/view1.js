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
            ['$scope','$routeParams','$location','$http',function($scope,$routeParams,$location,$http) {
    var restaurant = $routeParams.restId;

    var restaurantList = this;
    
    var selectedRestaurant = null;

    restaurantList.restaurants.forEach(function(value){
        if (value['id'] == restaurant)
            selectedRestaurant = value;
    });
    $.ajax({method:'GET',url:'http://156.35.95.63:8888/sparql?query=select ?p ?t ?v where { <'+selectedRestaurant['menu']+'> ?x ?p. ?p ?t ?v . }&output=json'}).
        done(function(data,status){
            var list = data['results']['bindings'];
            var items = [];
            selectedRestaurant['menuItems'] = items;
            list.forEach(function(value,index,array){
                if(!items.some(function(elment,index,array){element['id']==value['p']['value'];}))
                    items.push({'id':value['p']['value']});
                var it = items.filter(function(obj){
                    if(obj['id']==value['p']['value'])
                        return true;
                    else
                        return false;
                });
                
                switch(value['t']['value']){
                    case 'http://schema.org/description':
                        it['description']=value['v']['value'];
                        break;
                    case 'http://schema.org/name':
                        it['name']=value['v']['value'];
                        break;
                    case 'http://schema.org/price':
                        it['price']=value['v']['value'];
                        break;
                    case 'http://schema.org/priceCurrency':
                        it['priceCurrency']=value['v']['value'];
                        break;
                    case 'http://www.w3.org/2000/01/rdf-schema#container':
                        it['ingredients']=[]
                        $.ajax({method:'GET',url:'http://156.35.95.63:8888/sparql?query=select ?v where { <'+value['v']['value']+'> ?x ?v .}&output=json'}).
                            done(function(data){
                                data['results']['bindings'].forEach(function(v){
                                    it['ingredients'].push(v['v']['value']);
                                });
                            });
                        break;
                    
                }
            });
        }).
        fail(function(data,status){
            alert('cannot recover data from menu');
        });

    $scope.goBack = function(){
        $location.path('/');
    }

}])
/*
.controller('RestaurantController', ['$scope',function($scope) {
    restaurantList = this;
    restaurantList.restaurants = [];

}])
*/
.controller('View1Ctrl', ['$scope','$http',function($scope,$http) {
    var restaurantList = this;
    restaurantList.restaurants = [];
    $scope.fetch = function(){
        console.log($scope.url);
        console.log($scope.consulta);
        $.ajax($scope.url).done(function(data){
            $scope.result = data;
        });
    console.log("sending");
    //load data on sparql
    $.ajax({method:'GET',url:'http://156.35.95.63:8888/sparql?query=select%20*%20where{%20<http://156.35.95.63/Restaurants>%20<http://schema.org/Restaurant>%20?r%20.%20?r%20?p%20?o%20.}&output=json'})
        .done(function(data){
            var list = data['results']['bindings'];
            console.log("checkpoint");
            list.forEach(function(value,index,array){

                if(!restaurantList.restaurants.some(function(element,index,array){element['id']==value['r']['value'];}))
                    restaurantList.restaurants.push({'id':value['r']['value']});
                var res = restaurantList.restaurants.filter(function(obj){
                    if(obj['id']==value['r']['value'])
                        return true;
                    else
                        return false;});
                
                switch(value['p']['value']){
                    case 'http://schema.org/review':
                        res['review'] = value['o']['value'];
                        break;
                    case 'http://schema.org/description':
                        res['description'] = value['o']['value'];
                        break;
                    case 'http://schema.org/name':
                        res['name'] = value['o']['value'];
                        break;
                    case 'http://schema.org/address':
                        res['address'] = value['o']['value'];
                        break;
                    case 'http://schema.org/telephone':
                        res['telephone'] = value['o']['value'];
                        break;
                    case 'http://schema.org/geo':
                        res['geo'] = value['o']['value'];
                        break;
                    case 'http://purl.org/dc/elements/1.1/creator':
                        res['owner'] = value['o']['value'];
                        break;
                    case 'http://purl.org/dc/elements/1.1/location':
                        res['city'] = value['o']['value'];
                        break;
                    case 'http://schema.org/menu':
                        res['menu'] = value['o']['value'];
                        break;

                }
            });
            console.log(restaurantList);
        })
        .fail(function(data,status){
            console.log('Error, posible backend caído?');
        })
    }
//    console.log(restaurantList);
    $scope.url = 'http://156.35.98.21:3030';
}]);
