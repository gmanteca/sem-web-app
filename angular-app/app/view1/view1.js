'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl',
    resolve: {
        restaurants: function(Restaurants){
            return Restaurants.fetch();
        }
    }
  })
  .when('/restaurant',{
    templateUrl: 'view1/restaurants.html',
    controller: 'RestaurantController as restaurantList',
    resolve: {
        restaurants: function(Restaurants){
            return Restaurants.fetch();
        }
    }
  })
  .when('/restaurant/:restId*', {
    controller: 'RestaurantDetailController',
    templateUrl: 'view1/detail.html',
    resolve: {
        restaurants: function(Restaurants){
            return Restaurants.fetch();
        }
    }
  });
}])

.service('Restaurants',function(){
    this.fetch=function(){
        //return $.when(
        //var result= $.when(
        
        var restaurants = [];
        $.ajax({async:false,method:'GET',url:'http://156.35.95.63:8888/sparql?query=select%20*%20where{%20<http://156.35.95.63/Restaurants>%20<http://schema.org/Restaurant>%20?r%20.%20?r%20?p%20?o%20.}&output=json'})
        .done(function(data){

            var list = data['results']['bindings'];
            list.forEach(function(value,index,array){

                if(!restaurants.some(function(element,index,array){ return element['id']==value['r']['value'];})){
                    restaurants.push({'id':value['r']['value']});
                }
                var res = restaurants.filter(function(obj){
                    if(obj['id']==value['r']['value'])
                        return true;
                    else
                        return false;})[0];
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

            console.log(restaurants);
            return restaurants;
        });
        
        //)
        //.done(function(restaurants){
        //return restaurants;
        //});
        console.log(restaurants);

        return restaurants;
    }

})

.controller('RestaurantDetailController',
        function(restaurants,$scope,$routeParams,$location,$http) {
    var restaurant = $routeParams.restId;

    var restaurantList = this;
    console.log(restaurants);    
    var selectedRestaurant = null;

    restaurants.forEach(function(value){
        if (value['id'] == restaurant)
            selectedRestaurant = value;
    });
    $.ajax({method:'GET',url:'http://156.35.95.63:8888/sparql?query=select ?p ?t ?v where { <'+selectedRestaurant['menu']+'> ?x ?p. ?p ?t ?v . }&output=json'}).
        done(function(data,status){
            var list = data['results']['bindings'];
            var items = [];
            selectedRestaurant['menuItems'] = items;
            list.forEach(function(value,index,array){
                if(!items.some(function(element,index,array){ return element['id']==value['p']['value'];}))
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
                        it['ingredients']=[];
                        $.ajax({async:false,method:'GET',url:'http://156.35.95.63:8888/sparql?query=select ?v where { <'+value['v']['value']+'> ?x ?v .}&output=json'}).
                            done(function(data){
                                data['results']['bindings'].forEach(function(v){
                                    console.log(v);
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
    
    $scope.restaurant=selectedRestaurant;

    $scope.goBack = function(){
        $location.path('/');
    }
    console.log(selectedRestaurant);
})

.controller('View1Ctrl', function(restaurants){
    var restaurantList=this;
    console.log(restaurants);
    restaurantList.restaurants = restaurants;
})


.controller('RestaurantController', function(restaurants) {
    var restaurantList = this;
    console.log(restaurants);
    restaurantList.restaurants = restaurants;
//TODO THIS SHIT RECEIVES THE DATA FROM SPARQL
});
