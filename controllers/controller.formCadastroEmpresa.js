

smartSig.registerCtrl("formCadastroEmpresa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idEmpresa = $routeParams.id;

    $scope.empresa = {};
    $scope.error = '';  
    $scope.empresa.ativo = 1;
    $scope.ramoempresa = [];
    $scope.files = {};
    $scope.array_files = [0];
    $scope.cargos = [];
    $scope.departamentos = [];
    $scope.contatoempresa = {}
    $scope.contatoempresa.ativo = 1;

    //$scope.logotipo = '';


    $scope.cadastrarEmpresa = function() {

      if ($('#cadastroEmpresa-form').valid()) {        
        
        console.log('cadastrarEmpresa', $scope.empresa);

        $scope.json = angular.toJson($scope.empresa);

        $http.post('api/index.php/empresa/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);  
              $scope.empresa.id = data.id_empresa;

              if($scope.files != null){
                $scope.uploadFile($scope.files, data.id_empresa);
              }              
            }
            else
            {
              Mensagem.error(data.mensagem);   
            }
          }).error(function(data, status) { 

          });
        }

      }

      $scope.cadastrarContatoEmpresa = function() {

      if ($('#cadastroEmpresaContato-form').valid()) {
        console.log('contato', $scope.contatoempresa);
        $scope.contatoempresa.id_empresa = $scope.empresa.id;

        $scope.json = angular.toJson($scope.contatoempresa);

        $http.post('api/index.php/contatoempresa/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);  

              $scope.novoCadastroContato();
              $scope.getContatoEmpresa(idEmpresa);
              
            }
            else
            {
              Mensagem.error(data.mensagem);   
            }
          }).error(function(data, status) { 

          });
        }

    }

    $scope.delContatoEmpresa = function(indice, obj) {

      $scope.json = angular.toJson(obj);

      $http.post('api/index.php/delcontatoempresa/', $scope.json, 
       {withCredentials: true,
         headers: {'enctype': 'multipart/form-data' },
       }
       ).success(function(data, status, headers, config) {
         if (data.error == '0')
         {   
          Mensagem.success(data.mensagem);  
          $scope.getContatoEmpresa(idEmpresa);
        }
        else
        {
          Mensagem.error(data.mensagem);   
        }
      }).error(function(data, status) { 
      });
    }

    $scope.armazenaFile = function(files) {
      $scope.files = files;
    };    

    $scope.uploadFile = function(files,id) {

        if (files.name!='logotipo')
          return;

        var fd = new FormData();
        file = files.files[0];

        if(file){
          fd.append("file", file);

          $http.post('api/index.php/uploadlogo/'+id, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
          })
          .success(function(data, status, headers, config) {
            console.log(data);
          })
          .error(function(data, status) {
            // log error
          });
        }
      }     


  $scope.getRamoEmpresa = function(){
    $http.get('api/index.php/ramoempresa/').    
        success(function(data, status, headers, config) {         
          $scope.ramoempresa = data.ramoempresa;
          console.log($scope.ramoempresa)
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
  }

  $scope.getContatoEmpresa = function(id){
    $http.get('api/index.php/contatoempresa/'+id).    
        success(function(data, status, headers, config) {         
          $scope.contatosempresas = data.contato_empresa;
          console.log('getContatoEmpresa', $scope.contatosempresas);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
  }


    $scope.getIdEmpresa = function(){
      $http.get('api/index.php/empresa/'+idEmpresa).    
        success(function(data, status, headers, config) { 
        //console.log('asdasdasdasd',data);    
          $scope.empresa = data.empresa[0];

          console.log('empresa', $scope.empresa);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getDepartamento = function(){
        $http.get('api/index.php/departamento/').    
        success(function(data, status, headers, config) {                           
          $scope.departamentos = data.departamento;
          console.log('departamento', $scope.departamentos);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.novoCadastro = function(){
      $scope.empresa = {};
      $scope.status.ativo = 1;
    }

    $scope.novoCadastroContato = function(){
      $scope.contatoempresa = {};
      $scope.contatoempresa.ativo = 1;
    }

    $scope.editCadastroContato = function(obj){
      $scope.contatoempresa = obj;
      console.log('editCadastroContato', $scope.contatoempresa);
    }

    if (idEmpresa != undefined) {
      $timeout(function() {
        $scope.getIdEmpresa(idEmpresa);
      }, 800);      
    };

    $scope.getRamoEmpresa();
    $scope.getDepartamento(); 
    $scope.getContatoEmpresa(idEmpresa);
});