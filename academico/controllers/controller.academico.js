
var app = angular.module('app',["ngRoute","ngCkeditor","ui.bootstrap","ngAnimate","720kb.datepicker","ngSanitize","toaster",'checklist-model', 'ui.utils.masks', 'angular.filter']);

//$controllerProvider
app.config(['$filterProvider', '$controllerProvider','$routeProvider', function($filterProvider, $controllerProvider,$routeProvider){

	app.registerCtrl = $controllerProvider.register;

	app.resolveScriptDeps = function(dependencies){
		return function($q,$rootScope){
			var deferred = $q.defer();
			$script(dependencies, function() {                  
				$rootScope.$apply(function(){
					deferred.resolve();
				});
			});

			return deferred.promise;
		}
	};

	$routeProvider
	.when('/', {
		redirectTo: '/pages/signin'
	})
    .when('/:page', { // we can enable ngAnimate and implement the fix here, but it's a bit laggy
    	templateUrl: function($routeParams) {
    		return 'views/'+ $routeParams.page +'.html';
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })
    .when('/:page/:id', {
    	templateUrl: function($routeParams) {               
    		return 'views/'+ $routeParams.page + '.html?id='+$routeParams.id;
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })

    .when('/:page/:fase/:disciplina/:professor/:turma/:curso', {
    	templateUrl: function($routeParams) {               
    		return 'views/'+ $routeParams.page + '.html?fase='+$routeParams.fase+'&disciplina='+$routeParams.disciplina+'&professor='+$routeParams.professor+'&turma='+$routeParams.turma+'&curso='+$routeParams.curso;
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })

    .when('/:page/:fase/:disciplina/:professor/:turma/:curso/:componente/1', {
    	templateUrl: function($routeParams) {               
    		return 'views/'+ $routeParams.page + '.html?fase='+$routeParams.fase+'&disciplina='+$routeParams.disciplina+'&professor='+$routeParams.professor+'&turma='+$routeParams.turma+'&curso='+$routeParams.curso+'&componente='+$routeParams.componente;
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })

    .when('/:page/:fase/:disciplina/:professor/:turma/:curso/:aula', {
    	templateUrl: function($routeParams) {               
    		return 'views/'+ $routeParams.page + '.html?fase='+$routeParams.fase+'&disciplina='+$routeParams.disciplina+'&professor='+$routeParams.professor+'&turma='+$routeParams.turma+'&curso='+$routeParams.curso+'&aula='+$routeParams.curso;
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })
    .when('/:page/:turma/:curso/:serie', {
    	templateUrl: function($routeParams) {               
    		return 'views/'+ $routeParams.page + '.html?turma='+$routeParams.turma+'&curso='+$routeParams.curso+'&serie='+$routeParams.serie;
    	},
    	resolve: function($routeParams) {
    		return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
    	},              
    	controller: 'AcademicoController'
    })
    .when('/:page/:fase/:disciplina/:professor/:turma/', {
      templateUrl: function($routeParams) {               
        return 'views/'+ $routeParams.page + '.html?disciplina='+$routeParams.disciplina+'&professor='+$routeParams.professor+'&turma='+$routeParams.turma;
      },
      resolve: function($routeParams) {
        return {deps: app.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
      },              
      controller: 'AcademicoController'
    })
    .otherwise({
    	redirectTo: '/dashboard'
    });

}]);

app.factory('verificaPermissao', ['$http', function ($http) {
	return {
		getValor: function () {
			var host = window.location.origin;
			$http.get('../api/index.php/usuariologado/').    
			success(function(data, status, headers, config) {
				if(data.user == undefined || data.user == null){
					//window.location = host + '/sig/academico/';
					window.location = host + '/sig/academico/';
				}
			}).
			error(function(data, status, headers, config) {
        // log error
    });
		}
	};
}]);


app.directive("validateForm", function() {
	return {
		restrict: "A",
		link: function(a, b) {
			console.log('entrou no validate');
			console.log(b.find("[data-validate-input], [validate-input]").length);
			var c = {
				rules: {},
				messages: {},
				highlight: function(a) {
					if ($(a).hasClass("select2-offscreen")) {
						$("#s2id_" + $(a).attr("id") + " ul").addClass(errorClass);
					} else {
						$(a).closest(".inputValidate").removeClass("state-success").addClass("state-error has-error")                     
					}                        
				},
				unhighlight: function(a) {
					if ($(a).hasClass("select2-offscreen")) {
						$("#s2id_" + $(a).attr("id") + " ul").removeClass(errorClass);
					} else {
						$(a).closest(".inputValidate").removeClass("state-error has-error").addClass("state-success")
					}                        
				},
				errorElement: "em",
				errorClass: "invalid",
				errorPlacement: function(a, b) {
					a.insertAfter(b.parent(".inputValidate").length ? b.parent() : b)
				}
			};
			b.find("[data-validate-input], [validate-input]").each(function() {  

				var a = $(this),
				b = a.attr("name");
				c.rules[b] = {}, 
				void 0 != a.data("required") && (c.rules[b].required = !0), 
				void 0 != a.data("email") && (c.rules[b].email = !0), 
				void 0 != a.data("cnpj") && (c.rules[b].cnpj = !0), 
				void 0 != a.data("rangelength") && (c.rules[b].cnpj = !0), 
				void 0 != a.data("min") && (c.rules[b].min = !0), 
				void 0 != a.data("max") && (c.rules[b].max = !0), 
				void 0 != a.data("range") && (c.rules[b].range = !0), 
				void 0 != a.data("url") && (c.rules[b].url = !0), 
				void 0 != a.data("date") && (c.rules[b].date = !0), 
				void 0 != a.data("dateISO") && (c.rules[b].dateISO = !0), 
				void 0 != a.data("number") && (c.rules[b].number = !0), 
				void 0 != a.data("digits") && (c.rules[b].digits = !0), 
				void 0 != a.data("creditcard") && (c.rules[b].creditcard = !0), 
				void 0 != a.data("equalTo") && (c.rules[b].equalTo = !0), 
				void 0 != a.data("datebr") && (c.rules[b].datebr = !0), 
				void 0 != a.data("cpf") && (c.rules[b].cpf = !0), 
				void 0 != a.data("datetimebr") && (c.rules[b].datetimebr = !0),  
				void 0 != a.data("hora") && (c.rules[b].hora = !0), 
				void 0 != a.data("telefone") && (c.rules[b].telefone = !0),  
				void 0 != a.data("mobile") && (c.rules[b].mobile = !0),  
				void 0 != a.data("cep") && (c.rules[b].cep = !0), 
				void 0 != a.data("time") && (c.rules[b].time = !0), 
				void 0 != a.data("maxlength") && (c.rules[b].maxlength = a.data("maxlength")), 
				void 0 != a.data("minlength") && (c.rules[b].minlength = a.data("minlength")), 
				a.data("message") ? c.messages[b] = a.data("message") : angular.forEach(a.data(), function(a, d) {
					if (0 == d.search(/message/)) {
						c.messages[b] || (c.messages[b] = {});
						var e = d.toLowerCase().replace(/^message/, "");
						c.messages[b][e] = a
					}
				})
			}), b.validate(c)
}
}
})

app.directive("createLink", function($location, $timeout, $rootScope) {
	return {
		restrict: "A",
		link: function(scope, element) {			
			$timeout(function(){
				element.on("click", function(e) {					
					if(!jQuery('.slide').is(':visible') && element.hasClass('drop-down')){					                		
						jQuery('.slide').slideDown();                		
					}
					else{
						jQuery('.slide').slideUp();
						jQuery('.titulo').html(element.text());
					}
				});
			});
		}
	};
});


app.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
  	if (angular.isArray(arr)) {
  		for (var i = arr.length; i--;) {
  			if (comparator(arr[i], item)) {
  				return true;
  			}
  		}
  	}
  	return false;
  }
  
  // add
  function add(arr, item, comparator) {
  	arr = angular.isArray(arr) ? arr : [];
  	if(!contains(arr, item, comparator)) {
  		arr.push(item);
  	}
  	return arr;
  } 
  
  // remove
  function remove(arr, item, comparator) {
  	if (angular.isArray(arr)) {
  		for (var i = arr.length; i--;) {
  			if (comparator(arr[i], item)) {
  				arr.splice(i, 1);
  				break;
  			}
  		}
  	}
  	return arr;
  }
  
  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    
    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);
    
    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);
    
    
    var comparator = angular.equals;
    
    if (attrs.hasOwnProperty('checklistComparator')){
    	comparator = $parse(attrs.checklistComparator)(scope.$parent);
    }
    
    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
    	if (newValue === oldValue) {
    		return;
    	}
    	var current = getter(scope.$parent);
    	if (newValue === true) {
    		setter(scope.$parent, add(current, value, comparator));
    	} else {
    		setter(scope.$parent, remove(current, value, comparator));
    	}
    	
    	if (checklistChange) {
    		checklistChange(scope);
    	}
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
    	scope.checked = contains(newArr, value, comparator);
    }
    
    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
    	scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
    } else {
    	scope.$parent.$watch(attrs.checklistModel, setChecked, true);
    }
}

return {
	restrict: 'A',
	priority: 1000,
	terminal: true,
	scope: true,
	compile: function(tElement, tAttrs) {
		if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
			throw 'checklist-model should be applied to `input[type="checkbox"]`.';
		}
		
		if (!tAttrs.checklistValue) {
			throw 'You should provide `checklist-value`.';
		}
		
      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');
      
      return postLinkFn;
  }
};
}]);

app.filter('dataBrasil', [
	'$filter', function($filter) {
		return function(input, format) {
			return $filter('date')(new Date(input), format);
		};
	}
	]);

app.filter('startFrom', function() {
	return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
  // contains
  function contains(arr, item, comparator) {
  	if (angular.isArray(arr)) {
  		for (var i = arr.length; i--;) {
  			if (comparator(arr[i], item)) {
  				return true;
  			}
  		}
  	}
  	return false;
  }
  
  // add
  function add(arr, item, comparator) {
  	arr = angular.isArray(arr) ? arr : [];
  	if(!contains(arr, item, comparator)) {
  		arr.push(item);
  	}
  	return arr;
  } 
  
  // remove
  function remove(arr, item, comparator) {
  	if (angular.isArray(arr)) {
  		for (var i = arr.length; i--;) {
  			if (comparator(arr[i], item)) {
  				arr.splice(i, 1);
  				break;
  			}
  		}
  	}
  	return arr;
  }
  
  // http://stackoverflow.com/a/19228302/1458162
  function postLinkFn(scope, elem, attrs) {
    // compile with `ng-model` pointing to `checked`
    $compile(elem)(scope);
    
    // getter / setter for original model
    var getter = $parse(attrs.checklistModel);
    var setter = getter.assign;
    var checklistChange = $parse(attrs.checklistChange);
    
    // value added to list
    var value = $parse(attrs.checklistValue)(scope.$parent);
    
    
    var comparator = angular.equals;
    
    if (attrs.hasOwnProperty('checklistComparator')){
    	comparator = $parse(attrs.checklistComparator)(scope.$parent);
    }
    
    // watch UI checked change
    scope.$watch('checked', function(newValue, oldValue) {
    	if (newValue === oldValue) {
    		return;
    	}
    	var current = getter(scope.$parent);
    	if (newValue === true) {
    		setter(scope.$parent, add(current, value, comparator));
    	} else {
    		setter(scope.$parent, remove(current, value, comparator));
    	}
    	
    	if (checklistChange) {
    		checklistChange(scope);
    	}
    });
    
    // declare one function to be used for both $watch functions
    function setChecked(newArr, oldArr) {
    	scope.checked = contains(newArr, value, comparator);
    }
    
    // watch original model change
    // use the faster $watchCollection method if it's available
    if (angular.isFunction(scope.$parent.$watchCollection)) {
    	scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
    } else {
    	scope.$parent.$watch(attrs.checklistModel, setChecked, true);
    }
}

return {
	restrict: 'A',
	priority: 1000,
	terminal: true,
	scope: true,
	compile: function(tElement, tAttrs) {
		if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
			throw 'checklist-model should be applied to `input[type="checkbox"]`.';
		}
		
		if (!tAttrs.checklistValue) {
			throw 'You should provide `checklist-value`.';
		}
		
      // exclude recursion
      tElement.removeAttr('checklist-model');
      
      // local scope var storing individual checkbox model
      tElement.attr('ng-model', 'checked');
      
      return postLinkFn;
  }
};
}]);

app.controller('AcademicoController', ['$scope','$http','verificaPermissao', function($scope, $http, verificaPermissao, $routeParams, $route) {

	verificaPermissao.getValor();

	$scope.editorOptions = {
		language: 'pt'                
	};

	$scope.$on("ckeditor.ready", function( event ) {
		$scope.isReady = true;
	});
	$scope.classe = '';

	$scope.tabelaTurmas = [];

	$scope.turmas = {};

	$scope.login = {};
	$scope.tipoUsuario = "";

	$scope.modulos = [];
	$scope.caminho = [];

	$scope.menus = [];
	$scope.logado = false;

	$scope.teste = [];
	$scope.tipo_css = '';

	$scope.anos =
	[{"ano":"2014","status":"Aberto"},
	{"ano":"2013","status":"Fechado"},
	{"ano":"2012","status":"Fechado"},
	{"ano":"2011","status":"Fechado"},
	{"ano":"2010","status":"Fechado"},
	{"ano":"2009","status":"Fechado"}];

	$scope.logout = function(){
		window.location = '../api/index.php/logoutacademico';
	}

	$scope.usuarioLogado = function(){
		$http.get('../api/index.php/usuariologado/').    
		success(function(data, status, headers, config) {

			if(data.error == -1){
				$scope.error = data.mensagem;                  
				$scope.logado = false;
          		//$('#remoteModal').modal();
          		return;
          	}else{
          		$('#remoteModal').modal('hide');    
          		if ($scope.logado == true) {
          			return;
          		};

          		$scope.menus = data.user.user.modulo;
          		$scope.tipoUsuario = data.user.user.tipoUsuario;

          		$scope.nomeUsuario = data.user.user.nome;
          		$scope.descrTipoUsuario = data.user.user.idTipoUsuario;
          		$scope.carregarDadosUsuario(data.user.user.id);

          		$scope.tipo_css = data.user.user.id_papel;
          		
          		$scope.logado = true;

          	};  

          }).
		error(function(data, status, headers, config) {
        // log error
    }); 
	}

	$scope.carregarDadosUsuario = function(idUserLogado){
		$http.get('../api/index.php/carregardadosusuario/'+idUserLogado)
		.success(function(data, status, headers, config){
			if(data.error == 0){
				$scope.dadosusuario = data.retorno[0];
				fone = $scope.dadosusuario.telefone;

        fone=fone.replace(/\D/g,"");                  //Remove tudo o que não é dígito
        fone=fone.replace(/^(\d{2})(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
        fone=fone.replace(/(\d)(\d{4})$/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos

        $scope.dadosusuario.telefone = fone;
        tmp = $scope.tipoUsuario;
        $scope.tipoUsuario = tmp.trim().charAt(0).toUpperCase()+tmp.slice(1);

        dt = new Date();
        ano = dt.getYear();        
        $scope.dadosusuario.anoatual = (ano<1000) ? ano += 1900 : ano;         
    }
})
		.error(function(data, status, headers, config){});
	}

	$scope.carregarDadosAnoLetivo = function(){
		$http.get('../api/index.php/carregardadosanoletivo')
		.success(function(data, status, headers, config){
			if(data.error == 0){

				$scope.dadosanoletivo = data.retorno;        
			}
		})
		.error(function(data, status, headers, config){});
	}
	$scope.carregarDadosAnoLetivo();


/*	$scope.getLogout = function() {
		$http.get('../api/index.php/logoutacademico').    
		success(function(data, status, headers, config) {
			window.location = '../academico';
		}).
		error(function(data, status, headers, config) {
                  // log error
    });                 
}*/

$scope.changeClass = function(item){
	if(item.children == undefined){
		$scope.classe = 'nodrop-down';
	}
	else{
		$scope.classe = 'drop-down';
	}		
	
} 

$scope.usuarioLogado();


$(function () {
	$('[data-toggle="tooltip"]').tooltip();
});

}]);
//@ sourceURL=controller.academico.js