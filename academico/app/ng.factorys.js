smartSig.factory('Modulos',['$location', '$rootScope', function($location, $rootScope){
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
}]);

smartSig.factory('Permissao', function ($http, $q, $routeParams, $location) {

    var url = $routeParams['page'];

    if ($routeParams['child'] != undefined) {
      url += '/'+$routeParams['child'];
    };

    if ($routeParams['tipo'] != undefined) {
      url += '/'+$routeParams['tipo'];
    };

    console.log(url);

    return {       
        validaPermissao: function () {
            var deferred = $q.defer();
            $http({ method: "get", url: 'api/index.php/permissao/'+url })
                .success(function (data, status, headers, config) {
                    if (data['error'] == -1) {
                      $location.path('/error500');
                    };
                    deferred.resolve(data['permissoes']);
                }).error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    }
});

smartSig.factory('Caminhodepao',['$location', '$rootScope', function($location, $rootScope){
    var data="";

    return{
        setData:function(str){        
            data = str;
        },

        getData:function(){
            return data;
        },
    }
}]);

smartSig.factory('Mensagem',['toaster', function(toaster){
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

