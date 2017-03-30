/*
  Módulo: Mesquita
  Descrição: Configurar Conta de Usuario
  Método: GET
  URL: /forms/formCadastroConfigUsuario/1
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 04/02/2015
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 04/02/2015
 */
smartSig.registerCtrl("formCadastroConfigUsuario", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    /*
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });
    */
    //var idDeptoFuncionario = $routeParams.id;

    $scope.pessoa = {};         
    $scope.addConfig = {}; 
    $scope.addConfig.id = '';         
    $scope.estadocivil = {};
    $scope.files = '';
    $scope.id_tipo_entidade = '';

    $scope.getEstadoCivil = function(){
      $http.get('api/index.php/estadocivil/').    
      success(function(data, status, headers, config) {                           
        $scope.estadocivil = data.estado_civil;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    $scope.getPessoa = function(id){
      $http.get('api/index.php/pessoa/'+id).
        success(function(data, status, headers, config) {

          $scope.addConfig = data.pessoa[0];
          $scope.addConfig.data_nascimento += 'T12:00:00';

          fones = $scope.addConfig.telefones
          for (i = 0; i < fones.length; i++) { 

            if(fones[i].tipo_telefone=='Celular')     { $scope.addConfig.telefone_celular     = fones[i].numero_telefone; }
            if(fones[i].tipo_telefone=='Residencial') { $scope.addConfig.telefone_residencial = fones[i].numero_telefone; }
            if(fones[i].tipo_telefone=='Comercial')   { $scope.addConfig.telefone_comercial   = fones[i].numero_telefone; }
          }
        })
        .error(function(data, status, headers, config) {}); 
    }

    $scope.getUsuario = function(){
      $http.get('api/index.php/usuariologado/').    
        success(function(data, status, headers, config) {      
          $scope.addConfig.id = data.user.user.id;
          $scope.id_tipo_entidade = data.user.user.idTipoEntidade;
          $scope.getPessoa($scope.addConfig.id);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.armazenaFile = function(files) {
        $scope.files = files;
        console.log($scope.files);
    };

    $scope.chkPassAtual = function() {
      $http.get("api/index.php/autentica?&login="+$scope.addConfig.login+"&pwd="+$scope.addConfig.senha_atual+"&modulo="+$scope.id_tipo_entidade+"&trocarsenha=")
      .success(function(data, status, headers, config) {       

            if(data['error']!='0'){
              Mensagem.error('Senha atual inválida!');
              $scope.addConfig.senha_atual = '';
            }
        })
        .error(function(data, status, headers, config) {});
    }

    $scope.cadastrarConfigUsuario = function() {
      if ($('#cadastroConfigUsuario-form').valid()) {

        $scope.json = angular.toJson($scope.addConfig);
          
        $http.post('api/index.php/configUsuario/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       // transformRequest: angular.identity
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){   

              $scope.addConfig.senha_atual = '';
              $scope.addConfig.nova_senha = '';
              $scope.addConfig.confirmar_nova_senha = '';
              
              if ($scope.files != '' && data.id_pessoa != "") {              
                 $scope.uploadFile($scope.files, data.id_pessoa);
              };

              Mensagem.success(data.mensagem);  
           }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.chkPass = function(){ 
      if($scope.addConfig.confirmar_nova_senha!=$scope.addConfig.nova_senha)
      {
        Mensagem.error('As senhas digitadas não coincidem!'); 
        $scope.addConfig.confirmar_nova_senha = '';
        $scope.addConfig.nova_senha = '';
      }
    }

    $scope.uploadFile = function(files,id) {
        var fd = new FormData();
        
        file = files.files[0];
                
        if(file){
            fd.append("file", file);

            $http.post('api/index.php/uploadfile/'+id, fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(data, status, headers, config) {
              console.log(data);
            }).error(function(data, status) { 
              
            });
        }
    };

    $scope.$watch('addConfig.data_nascimento', function(){ 
      $scope.addConfig.data_nascimento1 = $scope.addConfig.data_nascimento;     
      if($scope.addConfig.data_nascimento1 != undefined || $scope.addConfig.data_nascimento1 != null){    
        $( "em[for='data_nascimento']" ).css("display","none"); 
      }
    });    

    $scope.$watch('addConfig.nova_senha', function(){ 
      if($scope.addConfig.nova_senha==''){$scope.addConfig.confirmar_nova_senha='';}
    });    



    //Inicializa Combos
    $scope.getEstadoCivil();
    $scope.getUsuario();
        
});
//@ sourceURL=controller.formCadastroConfigUsuario.js