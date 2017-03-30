var app = angular.module('app', [
    "ngRoute",                                          
    "mgo-angular-wizard", 
    "textAngular", 
    "angular-loading-bar",     
    "toaster",
    "ui.utils.masks",
    "ui.calendar",
    'ui.bootstrap',
    'plunker',                                
    'ngTable',                                
    'ngAnimate',
    'ngSanitize', 
    'ui.select',
    'ui.calendar',    
    'angularTreeview',
    'toggle-switch',
    'multipleDatePicker',                                
    'easypiechart',
    'angularUtils.directives.dirPagination', 
    'ngResource',    
    'nvd3ChartDirectives',
    'angular-jquery-maskedinput',
    'ui.tinymce',    
]);

//config
app.config(['$filterProvider', '$controllerProvider','$routeProvider', '$provide', '$compileProvider', function($filterProvider, $controllerProvider,$routeProvider, $provide, $compileProvider, appConst) {

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
            return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
        },              
        controller: 'AppCtrl'
    })
    .when('/:page/:child', {
        templateUrl: function($routeParams) {               
            return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html';
        },
        resolve: function($routeParams) {
            return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
        },              
        controller: 'AppCtrl'
    })
    .when('/:page/:child/:tipo', {
        templateUrl: function($routeParams) {               
            return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html?tipo='+$routeParams.tipo;
        },
        resolve: function($routeParams) {
            return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
        },              
        controller: 'AppCtrl'
    })
    .when('/:page/:child/:tipo/:id', {
        templateUrl: function($routeParams) {               
            return 'views/'+ $routeParams.page + '/' + $routeParams.child + '.html?tipo='+$routeParams.tipo+'id='+$routeParams.id;
        },
        resolve: function($routeParams) {
            return {deps: smartSig.resolveScriptDeps(['js/controller.'+$routeParams.page+'.js'])};
        },              
        controller: 'AppCtrl'
    })
    .otherwise({
        redirectTo: '/dashboard'
    });
    
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

//filtros
app.filter('horasFilter', function(){

    var date = new Date();
    date.setDate(date.getDate());
    
    var dateDia = parseInt(date.getDate());
    var dateMes = parseInt(date.getMonth()+1);
    if (dateDia < 10) {
      dateDia = "0"+dateDia;
    };
    if (dateMes < 10) {
      dateMes = "0"+dateMes;
    };

    var hora = parseInt(date.getHours());
    if (hora < 10) {
        hora = "0"+hora;
    };
    var minuto = parseInt(date.getMinutes());
    if (minuto < 10) {
        minuto = "0"+minuto;
    };
    var segundo = parseInt(date.getSeconds());
    if (segundo < 10) {
        segundo = "0"+segundo;
    };
    ;

    date = date.getFullYear()+''+dateMes+''+dateDia+''+hora + '' + minuto + '' + segundo;
    // $scope.diaAgora = date;

    // (hora.hora_agenda > horaAgora && agendas.dia_semana[$parent.$index].data == diaAgora) 
    // || agendas.dia_semana[$parent.$index].data > diaAgora


    return function(horas){
        var dataCompare = ''  
        var out = [];
        angular.forEach(horas, function(value, key) {      
            dataCompare = value.data_agenda.replace(/-/g, "")+value.hora_agenda.replace(/:/g, "");      
            
            // console.log(dataCompare, date, compare)      
            if (value.id_status == 30) {        
                if (dataCompare > date) {
                    out.push(horas[key]);
                };                  
            };            
        });  

        return out;
    }
});

app.filter('procedimentoFilter', function(){
    return function(example1,typeSel){
    
        if (typeSel == undefined) {
            return example1;
        };
        var out = [];
        angular.forEach(example1, function(value, key) {          
            angular.forEach(value.agenda_procedimento, function(value2, key2) {        
                if (value2.id_procedimento == typeSel) {          
                    out.push(example1[key]);
                };
            });
        });  

        if (out.length == 0) {
            return example1;
        }else{
            return out;
        };

        
    }
});

app.filter('filtroCampo', function(){
    return function(item, campo, valor){
        // console.log(campo, valor);
        // return;
        if (campo == undefined || valor == undefined) {
            return item;
        };
        var out = [];
        angular.forEach(item, function(value, key) {     
            // console.log(value[campo])                 
            if (value[campo] == valor) {          
                out.push(item[key]);
            };            
        });  

        // if (out.length == 0) {
        //     return item;
        // }else{
            return out;
        // };

        
    }
});

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;
                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }   
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

app.filter('cpf', function () {
    return function (cpf) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

            default:
            return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

//factory
app.factory('Auth', function(){
    var user;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return(user)? user : false;
        }
    }
});

app.factory("Data", function ($http) { 
 
        var obj = {};
      
        obj.get = function (q) {
            return $http.get('api/index.php/autentica?&login='+q.usuario+'&pwd='+q.senha+'&modulo='+q.modulo+'&trocarsenha='+q.trocarsenha+'&departamento_callcenter='+q.departamento_callcenter+'&dispositivo='+q.dispositivo).then(function (results) {
                return results.data;
            });
        };  

        obj.session = function (q) {
            return $http.get('api/index.php/usuariologado/').then(function (results) {
                return results.data;
            });
        };        
 
        return obj;
});

app.factory('socket', function($rootScope){
    var socket = io.connect('http://localhost:3333');

    return socket;
});

app.factory("Modulos", ['$location', '$rootScope', function($location, $rootScope) {
        var data="";
        return{
            setData:function(str){        
                data = str;
            },

            getData:function(){
                return data;
            },

            validaPermissao:function(rota){
              var valido = false;          
              var rotaCompleta = '/'+rota.page+'/'+rota.child;
              
              if(rota.tipo != undefined){
                rotaCompleta = '/'+rota.page+'/'+rota.child+'/'+rota.tipo;
            }                    
            angular.forEach(data, function(value, key) {                           
                if(rotaCompleta == value){                   
                  valido = true;
              }
          });
            console.log('valida página ',valido);
            if (valido == false) {
                $location.path('/error500');
            };
        }
    }
}])

app.factory("Mensagem", ["toaster", function(toaster) {
    return{
        success:function(str){        
            return toaster.pop('success', "Sucesso", str);
        },

        error:function(str){
            return toaster.pop('error', "Ocorreu um erro", str, '', 'trustedHtml');
        },

        warning:function(str){
            return toaster.pop('warning', "Aviso", str, '', 'trustedHtml');
        },
    }
}]);

app.factory('Scopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            $rootScope.$emit('scope.stored', key);
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

//directive
app.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});
app.directive("validateForm", function() {
        return {
            restrict: "A",
            link: function(a, b) {
                // console.log('entrou no validate');
                // console.log(b.find("[data-validate-input], [validate-input]").length);
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
});


app.directive('uiDate', function() {
    return {
      require: '?ngModel',
      link: function($scope, element, attrs, controller) {
          element.mask("99/99/9999",{completed: function() {
            if(controller != undefined){
                controller.$setViewValue(Date.parse(this.val(),"dd/MM/yyyy"));
                $scope.$apply();
            }
          }});
      }
    };
});

app.directive("toggleMinNav", ["$rootScope", function($rootScope) {
    return {
        restrict: "A",
        link: function(scope, ele) {
            var $window, Timer, app, updateClass;
            return app = $("#app"), $window = $(window), ele.on("click", function(e) {
                return app.hasClass("nav-min") ? app.removeClass("nav-min") : (app.addClass("nav-min"), $rootScope.$broadcast("minNav:enabled")), e.preventDefault()
            }), Timer = void 0, updateClass = function() {
                var width;
                return width = $window.width(), 768 > width ? app.removeClass("nav-min") : void 0
            }, $window.resize(function() {
                var t;
                return clearTimeout(t), t = setTimeout(updateClass, 300)
            })
        }
    }
    // }]).directive("collapseNav", [function() {
    //     return {
    //         restrict: "A",
    //         link: function(scope, ele) {
    //             var $a, $aRest, $lists, $listsRest, app;
    //             return $lists = ele.find("ul").parent("li"), $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>'), $a = $lists.children("a"), $listsRest = ele.children("li").not($lists), $aRest = $listsRest.children("a"), app = $("#app"), $a.on("click", function(event) {
    //                 var $parent, $this;
    //                 return app.hasClass("nav-min") ? !1 : ($this = $(this), $parent = $this.parent("li"), $lists.not($parent).removeClass("open").find("ul").slideUp(), $parent.toggleClass("open").find("ul").slideToggle(), event.preventDefault())
    //             }), $aRest.on("click", function() {
    //                 return $lists.removeClass("open").find("ul").slideUp()
    //             }), scope.$on("minNav:enabled", function() {
    //                 return $lists.removeClass("open").find("ul").slideUp()
    //             })
    //         }
    //     }
}]);

app.directive('action', function($http) {
    return {
        restrict: 'A',
        controller: ['$scope', '$http', function($scope, $http) {

          $scope.getLogout = function(city) {
            $http.get('api/index.php/logout').    
            success(function(data, status, headers, config) {                       
            }).
            error(function(data, status, headers, config) {
                  // log error
              });                 
        }

    }],
    
    link: function(scope, element, attrs, $http) {
            
             var smartActions = {
                // LOGOUT MSG 
                userLogout: function($this){

                    // ask verification
                    $.SmartMessageBox({
                        title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                        content : $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
                        buttons : '[Não][Sim]'
                        
                    }, function(ButtonPressed) {
                        if (ButtonPressed == "Sim") {
                            $.root_.addClass('animated fadeOutUp');
                            setTimeout(logout($http), 1000);
                        }
                    });
                    function logout() {                            
                        scope.getLogout();
                        window.location = $this.attr('href');              
                    }
                    
                },

                // LOGOUT MSG 
                userLock: function($this){

                    // ask verification
                    $.SmartMessageBox({
                        title : "<i class='fa fa-sign-out txt-color-orangeDark'></i> Logout <span class='txt-color-orangeDark'><strong>" + $('#show-shortcut').text() + "</strong></span> ?",
                        content : $this.data('logout-msg') || "You can improve your security further after logging out by closing this opened browser",
                        buttons : '[Não][Sim]'
                        
                    }, function(ButtonPressed) {
                        if (ButtonPressed == "Sim") {
                            $.root_.addClass('animated fadeOutUp');
                            setTimeout(logout($http), 1000);
                        }
                    });
                    function logout() {                            
                        scope.getLogout();
                        window.location = $this.attr('href');              
                    }
                    
                },                    
                
            };
            
            var actionEvents = {
                userLogout: function(e) {
                    smartActions.userLogout(element);
                },
                userLock: function(e) {
                    smartActions.launchFullscreen(document.documentElement);
                },
            };

            if (angular.isDefined(attrs.action) && attrs.action != '') {
                var actionEvent = actionEvents[attrs.action];
                if (typeof actionEvent === 'function') {
                    element.on('click', function(e) {
                        actionEvent(e);
                        e.preventDefault();
                    });
                }
            }
        }
    };
});

//services
app.service("pessoaService", function( $http, $q) {
        
    function getPessoas(val) {
    
        var deferredAbort = $q.defer();

        var request = $http({
            method: "get",
            url: "api/index.php/stringpaciente?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });
    
        var promise = request.then(
            function( response ) {                    
                return( response );
            }
        );
        
        promise.abort = function() {
            deferredAbort.resolve();
        };
        
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );

        return( promise );
    }

    // Return the public API.
    return({
        getPessoas: getPessoas
    });

});

//enderecos
app.service("enderecoService", function( $http, $q) {

    function getLogradouros(val) {

        var deferredAbort = $q.defer();
    
        var request = $http({
            method: "get",
            url: "api/index.php/consultaendereco?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });

        var promise = request.then(
            function( response ) {                
                return( response );
            }
        );
        
        promise.abort = function() {
            deferredAbort.resolve();
        };
        
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );

        return( promise );
    }

    // Return the public API.
    return({
        getLogradouros: getLogradouros
    });

});

//verifica ligação
app.service("verificaLigacaoService", function( $http, $q) {
    // função para buscar se existe ligações para o dispositivo passado
    function getLigacao(val) {
        
        var deferredAbort = $q.defer();
        // Initiate the AJAX request.
        var request = $http({
            method: "get",
            url: "api/index.php/ligacaopessoa/" + val,
            timeout: deferredAbort.promise,
            params: {}
        });
        
        var promise = request.then(
            function( response ) {
                return( response );
            }
        );
        
        promise.abort = function() {
            deferredAbort.resolve();
        };

        promise.finally(
            function() {
                console.info( "getLigacao - Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );
        return( promise );
    }
    
    return({
        getLigacao: getLigacao
    });

});

//fornecedor
app.service("fornecedorService", function( $http, $q) {
    function getFornecedor(val) {
        var deferredAbort = $q.defer();
        var request = $http({
            method: "get",
            url: "api/index.php/stringfornecedor?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });
    
        var promise = request.then(
            function( response ) {                    
                return( response );
            }
        );
        
        promise.abort = function() {
            deferredAbort.resolve();
        };
        
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );

        return( promise );
    }

    // Return the public API.
    return({
        getFornecedor: getFornecedor
    });
});

//cpf
app.service("cpfService", function( $http, $q) {
    function getCpf(val) {
        var deferredAbort = $q.defer();
        var request = $http({
            method: "get",
            url: "api/index.php/stringpaciente?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });
        var promise = request.then(
            function( response ) {                    
                return( response );
            }
        );
        promise.abort = function() {
            deferredAbort.resolve();
        };
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );
        return( promise );
    }
    // Return the public API.
    return({
        getCpf: getCpf
    });
});

//telefone
app.service("telefoneService", function( $http, $q) {
    function getTelefone(val) {
        var deferredAbort = $q.defer();
        var request = $http({
            method: "get",
            url: "api/index.php/stringpaciente?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });
        var promise = request.then(
            function( response ) {                    
                return( response );
            }
        );
        promise.abort = function() {
            deferredAbort.resolve();
        };
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );
        return( promise );
    }
    // Return the public API.
    return({
        getTelefone: getTelefone
    });
});

//item
app.service("itemService", function( $http, $q) {
    function getItemDescricao(val) {
        var deferredAbort = $q.defer();
        var request = $http({
            method: "get",
            url: "api/index.php/descricaoitem?",
            timeout: deferredAbort.promise,
            params: {
              string: val
            }
        });
        var promise = request.then(
            function( response ) {                    
                return( response );
            }
        );
        promise.abort = function() {
            deferredAbort.resolve();
        };
        promise.finally(
            function() {
                console.info( "Cleaning up object references." );
                promise.abort = angular.noop;
                deferredAbort = request = promise = null;
            }
        );
        return( promise );
    }
    // Return the public API.
    return({
        getItemDescricao: getItemDescricao
    });
});


// app.run(function ($rootScope) {
//     $rootScope.$on('scope.stored', function (event, data) {
//         console.log("scope.stored", data);
//     });
// });

// app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
//     $rootScope.$on('$routeChangeStart', function (event) {

//         if (!Auth.isLoggedIn()) {
//             console.log('DENY');
//             event.preventDefault();
//             // $location.path('/login');
//         }
//         else {
//             console.log('ALLOW');
//             // $location.path('/home');
//         }
//     });
// }]);

app.run(function ($rootScope, $location, Data, Auth, Modulos, socket) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {        
        $rootScope.authenticated = false;
        Data.session('session').then(function (results) {
            // console.log('results');
            if (results.error != -1) {
                $rootScope.authenticated = true;
                $rootScope.usuario = results.user.user;

                if ($rootScope.usuario.foto == null) {
                    if ($rootScope.usuario.sexo == 'M') {
                        $rootScope.usuario.foto = 'male.png';
                    }else{
                        $rootScope.usuario.foto = 'female.png';
                    }   
                }                    

                Auth.setUser(results.user.user);

                // socket.on('connect', function () {
                //     console.log('Socket Connected IO 1')
                    var sessionId = socket.id;
                    // console.log('Socket Connected IO 2 ' + sessionId);
                    socket.emit('newUser', {id: sessionId, name: $rootScope.usuario.nome, idUsuario: $rootScope.usuario.id});
                // });
                
            } else {
                var nextUrl = next.$$route.originalPath;
                if (nextUrl == '/signup' || nextUrl == '/login') {

                } else {
                    $location.path("/pages/signin");
                }
            }

        });
        
    });
});

//controllers

app.controller("AppCtrl", ["$scope", "$location", "$http", "Modulos", "$timeout","Mensagem", '$filter', 'filterFilter', 'Scopes', 'Auth', 'Data', '$compile', function($scope, $location, $http, Modulos, $timeout,Mensagem, $filter, filterFilter, Scopes, Auth, Data, $compile) {
    
    $scope.isSpecificPage = function() {
        var path;
        return path = $location.path(), _.contains(["/404", "/pages/500", "/pages/login", "/pages/signin", "/pages/signin1", "/pages/signin2", "/pages/signup", "/pages/signup1", "/pages/signup2", "/pages/lock-screen"], path)
    }

    $scope.main = {
        brand: "logo.png",
        name: "Lisa Doe"
    }

    $scope.esqueceuSenha = false;

    $scope.login = {};

    $scope.novasenha = false; 
    
    $scope.dispositivos = [];

    $scope.show_dispositivo = false;
    $scope.login.departamento_callcenter = false;

    $scope.enviarEmail = function(){    
        if ($('#login-form').valid()) {

            $scope.json = angular.toJson($scope.esqueceu);

            $http.post('api/index.php/esqueceusenha/', $scope.json, 
                {withCredentials: true, headers: {'enctype': 'multipart/form-data' },}
            ).success(function(data, status, headers, config) {
                if (data.error == '0'){  
                    Mensagem.success(data.mensagem); 
                    $scope.esqueceuSenha = false;
                }else{
                    Mensagem.error(data.mensagem);   
                }
            }).error(function(data, status) { 
            });
        }
    }

    $scope.verificaDepto = function() {
        if ( $scope.login.usuario != "" ) {
            $http.get('api/index.php/deptologin/'+$scope.login.usuario).
            success(function(data, status, headers, config) {
                if(data['error']=='0'){
                    if(data['id_departamento']=='5'){
                        $scope.getDispositivo();
                        $scope.login.departamento_callcenter = true;
                        $scope.show_dispositivo = true;
                    } else {
                        $scope.login.departamento_callcenter = false;
                        $scope.show_dispositivo = false;
                    }
                }
            }).error(function(data, status, headers, config) {
                // log error
            });
        } else {
            $scope.login.departamento_callcenter = false;
            $scope.show_dispositivo = false;
        }
    }
    //validar dados do dispositivo selecionado

    $scope.getDispositivo = function(){
        $http.get('api/index.php/dispositivo/').    
        success(function(data, status, headers, config) {
            $scope.dispositivos  = data.dispositivo; 
        }).
        error(function(data, status, headers, config) {
        // log error
        });
    }

    $scope.closeAlerta = function(){
        $('.alertaLogin').html('');
        $('#login .alert').slideUp();
    }

    $scope.doLogin = function (login) {
        if ($('#login-form').valid()) {

            if ($scope.novasenha == true) {             
                if ($scope.senha != $scope.senharepeat) {
                    $('.alertaLogin').html('Senhas não conferem');
                    $('#login .alert').slideDown();                                  
                    return;
                }
                else{
                    $scope.login.trocarsenha = 1;
                }
            };

            Data.get(login).then(function (results) {               
                console.log(results)

                if (results.error == '-1') {
                    $('.alertaLogin').html(results['errorMsg']);
                    $('#login .alert').slideDown();
                    return;
                }

                if(results['error']=='-2'){
                    $('.alertaLogin').html(results['errorMsg']);
                    $('#login .alert').slideDown();
                    $scope.login.senha = '';
                    $scope.login.novasenha = true;
                    $scope.login.trocarsenha = 1;
                    return;
                }

                if(results['error']=='-3'){
                    $('.alertaLogin').html(results['errorMsg']);
                    $('#login .alert').slideDown();
                    $scope.login.senha = '';
                    $scope.novasenha = true;
                    $scope.trocarsenha = 1;
                    return;
                }

                if(results['error']=='0'){                    
                    //enviar dados para setar a tabela
                    if ( results['user']['id_papel'] == 2 ){
                        // $location.path('/consulta/consultaConsultaDetalhada');
                        window.location.href = 'dashboard.html#/consulta/consultaConsultaDetalhada';
                    } else {
                        $location.path('/dashboard');
                        // window.location.href = 'dashboard.html#/dashboard';
                    }
                } 
                
            });
        }
    };

    $scope.getLogout = function() {                
        $http.get('api/index.php/logout').    
        success(function(data, status, headers, config) {
            $timeout.cancel($scope.prom);
            window.location.href = 'index.html#/pages/signin';
        }).error(function(data, status, headers, config) {
            // log error
        });                 
    }

    //this variable represents the total number of popups can be displayed according to the viewport width
    var total_popups = 0;
    
    //arrays of popups ids
    var popups = [];

    $scope.close_popup = function(id)
    {
        for(var iii = 0; iii < popups.length; iii++)
        {
            if(id == popups[iii])
            {
                // Array.remove(popups, iii);

                
                popups.splice(iii, 1);                

                document.getElementById(id).style.display = "none";

                $scope.calculate_popups();

                return;
            }
        }   
    }

    $scope.display_popups = function()
    {
        var right = 220;

        var iii = 0;
        for(iii; iii < total_popups; iii++)
        {
            if(popups[iii] != undefined)
            {
                var element = document.getElementById(popups[iii]);
                element.style.right = right + "px";
                right = right + 320;
                element.style.display = "block";
            }
        }

        for(var jjj = iii; jjj < popups.length; jjj++)
        {
            var element = document.getElementById(popups[jjj]);
            element.style.display = "none";
        }
    }

    $scope.register_popup = function(id, name)
    {
        console.log(name);

        var nome = name;

        for(var iii = 0; iii < popups.length; iii++)
        {   
            //already registered. Bring it to front.
            if(id == popups[iii])
            {
                Array.remove(popups, iii);

                popups.unshift(id);

                $scope.calculate_popups();


                return;
            }
        }               
        
        var element = '<div class="popup-box chat-popup" id="'+ id +'">';
        element = element + '<div class="popup-head">';
        element = element + '<div class="popup-head-left">'+ nome +'</div>';
        element = element + '<div class="popup-head-right"><a ng-click="close_popup(\''+ id +'\');">&#10005;</a></div>';
        element = element + '<div style="clear: both"></div></div><div id="historico" class="popup-messages"></div><div style="position: fixed; bottom: 0; width:300px;"><textarea id="mensagem" onKeyDown="if(event.keyCode==13) enviar();" row="4" style="position: fixed; bottom: 0; width:300px; font-size: 11px;""></textarea></div></div>';
        
        // document.getElementById("chat-box").innerHTML = document.getElementById("chat-box").innerHTML + element;  

        $("#chat-box").append( $compile(element)($scope) );    

        popups.unshift(id);

        $scope.calculate_popups();
        
    }

    window.enviar = function(){                
        //var nome = document.getElementById('nome').value; 
        var msg = document.getElementById('mensagem').value;    
        socket.emit('paraServer', {msg: msg,  nome : nome});
        document.getElementById('mensagem').value = "";
    };

    $scope.calculate_popups = function()
    {
        var width = window.innerWidth;
        if(width < 540)
        {
            total_popups = 0;
        }
        else
        {
            width = width - 200;
            //320 is width of a single popup box
            total_popups = parseInt(width/320);
        }
        
        $scope.display_popups();
        
    }
    window.addEventListener("resize", $scope.calculate_popups());
    window.addEventListener("load", $scope.calculate_popups());

    function filterFilter() {
        return function(array, expression, comparator) {
            if (!isArray(array)) return array;
            var comparatorType = typeof(comparator),
            predicates = [];

            predicates.check = function(value) {
                for (var j = 0; j < predicates.length; j++) {
                    if(!predicates[j](value)) {
                        return false;
                    }
                }
                return true;
            };

            if (comparatorType !== 'function') {
                if (comparatorType === 'boolean' && comparator) {
                    comparator = function(obj, text) {
                        return angular.equals(obj, text);
                    };
                } else {
                    comparator = function(obj, text) {
                        if (obj && text && typeof obj === 'object' && typeof text === 'object') {
                            for (var objKey in obj) {
                                if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) &&
                                    comparator(obj[objKey], text[objKey])) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        text = (''+text).toLowerCase();
                        return (''+obj).toLowerCase().indexOf(text) > -1;
                    };
                }
            }

            var search = function(obj, text){
                if (typeof text == 'string' && text.charAt(0) === '!') {
                    return !search(obj, text.substr(1));
                }
                switch (typeof obj) {
                    case "boolean":
                    case "number":
                    case "string":
                        return comparator(obj, text);
                    case "object":
                        switch (typeof text) {
                            case "object":
                            return comparator(obj, text);
                            default:
                            for ( var objKey in obj) {
                                if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                                    return true;
                                }
                            }
                            break;
                        }
                        return false;
                    case "array":
                        for ( var i = 0; i < obj.length; i++) {
                            if (search(obj[i], text)) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                }
            };
    
            switch (typeof expression) {
                case "boolean":
                case "number":
                case "string":
                    // Set up expression object and fall through
                    expression = {$:expression};
                    // jshint -W086
                case "object":
                    // jshint +W086
                    for (var key in expression) {
                        (function(path) {
                            if (typeof expression[path] == 'undefined') return;
                            predicates.push(function(value) {
                                return search(path == '$' ? value : (value && value[path]), expression[path]);
                            });
                        })(key);
                    }
                    break;
                case 'function':
                    predicates.push(expression);
                    break;
                default:
                    return array;
            }
    
            var filtered = [];
            for ( var j = 0; j < array.length; j++) {
                var value = array[j];
                if (predicates.check(value)) {
                    filtered.push(value);
                }
            }
            return filtered;
        };
    }

}]);