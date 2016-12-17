var app = angular.module('wp', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: localized.partials + 'main.html',
        controller: 'Main'
    })
    .when('/:slug',{
    	templateUrl: localized.partials + 'content.html',
    	controller: 'Content'
    })
    .otherwise({
    	redirectTo: '/'
    });
}])
.controller('Main', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	//console.log('controller part working1'); 
    $http.get('angularWordpress/index.php/wp-json/wp/v2/posts').then(
    	function success(res){
    		console.log(res.data);
	        $scope.posts = res.data;
    	},
    	function error(res){
    		console.log(res);
    	}
    );
}])
.controller('Content', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams, Data) {
	//console.log('controller part working2'); 
    $http.get('angularWordpress/index.php/wp-json/wp/v2/posts?slug=' + $routeParams.slug).then(
    	function success(res){
    		$scope.post = res.data[0];
    		$scope.title = res.data[0].title.rendered;
    		$scope.date = res.data[0].date;
    		$scope.type = res.data[0].type;
    		$scope.content = res.data[0].content.rendered;

    		$scope.categories = res.data[0].categories;

            $scope.test = "test";
            $scope.$watch('test', function (newValue, oldValue) {
                if (newValue !== oldValue) Data.setFirstName(newValue);
            });
/*
            $scope.category = function(){
    			var categoriesLength = res.data[0].categories.length;

    			for(var i=0; i<categoriesLength; i++){
        			$http.get('angularWordpress/index.php/wp-json/wp/v2/categories/'+res.data[0].categories[i]).then(
    					function success(response){
                            //console.log(response.data.name);
    						$scope.categoryName = response.data.name;
                            $scope.categoryLink = response.data.link;
    					},
    					function error(response){
    						console.log(response);
    					}
        			);
    			}
                console.log($scope.categoryName);
            }*/
    	},
    	function error(res){
    		console.log(res);
    	}
    );
}])
.controller('test',function($scope, Data){
    $scope.$watch(function () { return Data.getFirstName(); }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.categories = newValue;
    });

    console.log($scope.categories);
})
.factory('Data', function(){
    var data = {
        FirstName: ''
    };

    return {
        getFirstName: function () {
            return data.FirstName;
        },
        setFirstName: function (categories) {
            data.FirstName = categories;
        }
    };
})
/*.controller('categories', ['$scope', '$http', '$routeParams', function($scope,$http, $routeParams){
	$scope.init = function(]){
		$scope.result = "";
		var categoriesLength = categories.length;

		for(var i=0; i<categoriesLength; i++){
			$http.get('angularWordpress/index.php/wp-json/wp/v2/categories?id='+ categories[i]).then(
				function success(res){
					console.log($scope.result.slug);
					$scope.result = $scope.result+i.toString()+",";
				},
				function error(res){
					console.log(res);
				}
			);
		}
	}
}])*/
.filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});