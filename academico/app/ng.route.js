smartSig.config(['$filterProvider', '$controllerProvider','$routeProvider', '$provide', '$compileProvider', function($filterProvider, $controllerProvider,$routeProvider, $provide, $compileProvider, appConst) {
	
	smartSig.registerCtrl = $controllerProvider.register;

	smartSig.resolveScriptDeps = function(dependencies){
      return function($q,$rootScope){
        var deferred = $q.defer();
        $script(dependencies, function() {
          // all dependencies have now been loaded by $script.js so resolve the promise
          $rootScope.$apply(function()
          {
            deferred.resolve();
          });
        });

        return deferred.promise;
      }
    };

    $routeProvider
		.when('/', {
			redirectTo: '/dashboard'
		})

		/* For DEMO purposes, we are loading our views dynamically by passing arguments to the location url */

		// A bug in smartwidget with angular (routes not reloading). 
		// We need to reload these pages everytime so widget would work
		// The trick is to add "/" at the end of the view.
		// http://stackoverflow.com/a/17588833
		.when('/:page', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
			templateUrl: function($routeParams) {
				return 'views/'+ $routeParams.page +'.html';
			},
			resolve: function($routeParams) {
				return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
			},          	
			controller: 'PageViewController'
		})
		.when('/:page/:child', {
			templateUrl: function($routeParams) {				
				return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html';
			},
			resolve: function($routeParams) {
				return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
			},          	
			controller: 'PageViewController'
		})
		.when('/:page/:child/:tipo', {
			templateUrl: function($routeParams) {				
				return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html?tipo='+$routeParams.tipo;
			},
			resolve: function($routeParams) {
				return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
			},          	
			controller: 'PageViewController'
		})
		.when('/:page/:child/:tipo/:id', {
			templateUrl: function($routeParams) {				
				return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html?tipo='+$routeParams.tipo+'id='+$routeParams.id;
			},
			resolve: function($routeParams) {
				return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
			},          	
			controller: 'PageViewController'
		})
		.otherwise({
			redirectTo: '/dashboard'
		})
    
	;

	// with this, you can use $log('Message') same as $log.info('Message');
	$provide.decorator('$log', function($delegate) {
        // create a new function to be returned below as the $log service (instead of the $delegate)
        function logger() {
            // if $log fn is called directly, default to "info" message
            logger.info.apply(logger, arguments);
        }
        // add all the $log props into our new logger fn
        angular.extend(logger, $delegate);
        return logger;
    });

}]);