smartSig.registerCtrl("formCadastroEntidade", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });


    var idEntidade = $routeParams.id;

    $scope.id_entidade = idEntidade;

    $scope.entidade = {};
    $scope.endereco = {};
    $scope.estados = {};
    $scope.cidades = {}; 
    $scope.paises = {};   
    $scope.tipoentidade = {};  
    $scope.entidade.idTipoEntidade = {};
    $scope.pessoa = [];
    $scope.diretor = {};
    $scope.tesoureiro = {};
    $scope.secretario = {};
    $scope.logado = {};
    $scope.error = '';

    $scope.mascara = '15';

    if(idEntidade == '' || idEntidade == null){
      $scope.thumb = 'foto_no_thumb.jpg';
    }

    //Busca lista de países
    $scope.getPaises = function(){
      $http.get('api/index.php/pais').
      success(function(data, status, headers, config) {
        $scope.paises = data.paises;
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    //busca lista de cidades, porém pega dados retornados pelo cep anteriormente
    $scope.getCidade = function(nome){
      angular.forEach($scope.estados, function(value, key) {
        if(nome == value.nome){
          $scope.cidades = $scope.estados[key].cidades;
          console.log('cidades', $scope.cidades);
        }
      });
    }

    //Funcionalidade para buscar dados do cep digitado
    $scope.getCep = function(id){

      $scope.estados={};
      $scope.cidades={};

      $http.get('api/index.php/cep/'+$scope.entidade.cep).    
      success(function(data, status, headers, config) {                 
        if(data[0].error == -1){
          $scope.error = data[0].mensagem;
          Mensagem.error(data[0].mensagem);
        }else{
          $scope.entidade.cep         = data[0].endereco.cep;
          $scope.entidade.logradouro  = data[0].endereco.logradouro;
          $scope.entidade.bairro = data[0].endereco.bairro;
          $scope.entidade.estado = data[0].endereco.estado;
          $scope.entidade.cidade = data[0].endereco.cidade;
          $scope.entidade.idPais = data[0].endereco.idPais;
          
          $scope.estados = data[0].estados;
          angular.forEach(data[0].estados, function(value, key) {
            if($scope.entidade.estado == value.uf){
              $scope.cidades = data[0].estados[key].cidades;
            }
          });

          $scope.paises = data[0].pais;
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //verifica se entidade já existe na base de dados
    $scope.getCnpjEntidade = function(id){
      var cnpj = $("#"+id).val();

      if (cnpj.length > 0) {
        cnpj = cnpj.replace(".", "");
        cnpj = cnpj.replace("/", "");
        cnpj = cnpj.replace("-", "");
        cnpj = cnpj.replace(".", "");

        $http.get('api/index.php/cnpjentidade/'+cnpj).        
        success(function(data, status, headers, config) {                 
          if(data[0].error == -1){
            $scope.error = data[0].mensagem;

            if (data[0].id_entidade!=$scope.entidade.id) {
              Mensagem.error(data[0].mensagem); 
              SalvarEntidade.disabled = true; 
            } else {
              SalvarEntidade.disabled = false;
            }
          } else {
            SalvarEntidade.disabled = false;
          }         
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
      };
    }

    //Busca lista do tipo de entidade
    $scope.getTipoEntidade = function(){
      $http.get('api/index.php/tipoentidade/').    
      success(function(data, status, headers, config) {
        $scope.tipoentidade = data;          
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //Busca lista de pessoas que pertencam a aquela entidade
    $scope.getEntidadePessoa = function(id){
      $http.get('api/index.php/entidadepessoa/' + id).    
      success(function(data, status, headers, config) {
        $scope.pessoa = data;        
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }    

    //Funcionalidade para cadastrar a entidade
    $scope.cadastrarEntidade = function(objeto) {      
      if ($('#cadastroEntidade-form').valid()) {
        //validação se as pessoas diretor, secretario e tesoureiro não são a mesma pessoa
        if( $scope.entidade.id_pessoa_diretor != null || $scope.entidade.id_pessoa_secretario != null || $scope.entidade.id_pessoa_tesoureiro != null ){
          if(($scope.entidade.id_pessoa_diretor == $scope.entidade.id_pessoa_secretario && $scope.entidade.id_pessoa_secretario != null && $scope.entidade.id_pessoa_secretario != '') || ($scope.entidade.id_pessoa_secretario == $scope.entidade.id_pessoa_tesoureiro && $scope.entidade.id_pessoa_tesoureiro != null && $scope.entidade.id_pessoa_tesoureiro != '') || ($scope.entidade.id_pessoa_tesoureiro == $scope.entidade.id_pessoa_diretor && $scope.entidade.id_pessoa_diretor != null && $scope.entidade.id_pessoa_diretor != '')){
            Mensagem.error('Diretor, Secretário e Tesoureiro devem ser pessoas distintas');
            return;
          }
        }
        var fone = $scope.entidade.telefone;
        if(fone != undefined){
          $scope.entidade.telefone = fone.substring(1, fone.length);  
        }

        $scope.json = angular.toJson($scope.entidade);
        SalvarEntidade.disabled = true; 
        
        $http.post('api/index.php/entidade/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          console.log('DATA DA ENTIDADE', data);
           if (data.error == '0')
           {
            if ($scope.files != null) {
              $scope.uploadFile($scope.files, data.id_entidade);
            };
            $scope.objeto = {}; 
            Mensagem.success(data.mensagem);   
          }
          else
          {
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 
          //log error
        });
        SalvarEntidade.disabled = false; 
      }
    }  

    //Busca dados do usuário logado
    $scope.getUserLogado = function(){
      $http.get('api/index.php/usuariologado/').    
        success(function(data, status, headers, config) {
          $scope.logado = data['user']['user'];
          $scope.entidade.idTipoEntidade = data['user']['user'].idTipoEntidade
          $scope.getEntidadePessoa($scope.entidade.idTipoEntidade);
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    //Preenche os dados do cadastro caso o id tenha sido passado
    $scope.getIdEntidade = function(){
      $http.get('api/index.php/entidade/'+idEntidade).
        success(function(data, status, headers, config) {
          $scope.entidade = data.entidade[0];
          $scope.getCep();
          if ( data.entidade[0].id_pessoa_diretor == null ){
            $scope.entidade.id_pessoa_diretor = '';
          }
          if ( data.entidade[0].id_pessoa_secretario == null ){
            $scope.entidade.id_pessoa_secretario = '';
          }
          if ( data.entidade[0].id_pessoa_tesoureiro == null ){
            $scope.entidade.id_pessoa_tesoureiro = '';
          }          
          $scope.thumb = data.entidade[0].logotipo;
          
          SalvarEntidade.disabled = false;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.armazenaFile = function(files) {
      $scope.files = files;
    }; 

    $scope.uploadFile = function(files,id) {
      var fd = new FormData();
      file = files.files[0];
      if(file){
        fd.append("file", file);
        $http.post('api/index.php/logotipo_matriz/'+id, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data, status, headers, config) {
          $scope.thumb = 'foto_'+data.arquivo;
          console.log("THUMBNAIL",$scope.thumb);
        }).error(function(data, status) { 
        });
      }
    };
    
    //Inicializa dados para um novo cadastro
    $scope.novoCadastro = function(){
      $scope.entidade = {};
      $scope.entidade.ativo = 1;
    }

    
    //Inicializa Combos
    $scope.getTipoEntidade();
    $scope.getUserLogado();
     
    //inicializa dados da entidade buscada
    if (idEntidade != undefined) {
      $timeout(function() {
        $scope.getIdEntidade();
      }, 800);
    };
});
//@ sourceURL=controller.formCadastroEntidade.js