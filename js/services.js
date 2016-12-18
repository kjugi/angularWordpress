function ThemeService($http){
	
	var ThemeService = {
		categories: [],
		posts: [],
		pageTitle: 'Ostatnie posty:',
		currentPage: 1,
		totalPages: 1,
		currentUser: {}
	};

	//set the title tag in head
	function _setTitle(documentTitle, pageTitle){
		document.querySelector('title').innerHTML = documentTitle + ' | angular JS theme';
		ThemeService.pageTitle = pageTitle;
	}

	//setup pagination
	function _setArchivePage(posts, page, headers){
		ThemeService.posts = posts;
		ThemeService.page = page;
		ThemeService.headers = headers('X-WP-TotlaPages');
	}

	ThemeService.getAllCategories = function(){
		//if set don't set again
		if(ThemeService.categories.length){
			return;
		}

		//get cat from json
		return $http.get('angularWordpress/index.php/wp-json/wp/v2/taxonomies/category').then(
			function success(response){
				ThemeService.categories = response;
			},
			function error(response){
				console.log('error category '+response);
			}
		);
	}

	ThemeService.getPosts = function(page){
		return $http.get('angularWordpress/index.php/wp-json/wp/v2/pages').then(
			function success(response, status, headers){
				ThemeService.posts = response;
				page = parseInt(page);

				//check page variable for sanity
				if(isNaN(page) || page > headers('X-WP-TotlaPages')){
					_setTitle('page not foung','page not found');
				}
				else{
					//pagination
					if(page>1){
						_setTitle('Posts on page '+page, 'Posts on page '+page+':');
					}
					else{
						_setTitle('Home page','Latest posts:');
					}

					_setArchivePage(response,page,headers);
				}
			},
			function error(response){
				console.log('error post '+response);
			}
		)
	};

	return ThemeService;
}

app.factory('ThemeService', ['$http',ThemeService]);