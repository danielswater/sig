  /*
  Módulo: Mesquita
  Descrição: CRUD Bens
  Método: GET
  URL: /gestao/formCadastroBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroParametrosCobranca", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idParametro = $routeParams.id;

    var classCol = [
        {
          'show_data': false,
          'desabilitar': true,
          'porcentagem_desconto': 'col col-lg-3 col-md-3 col-sm-3 col-xs-3',
          'valor_desconto': 'col col-lg-3 col-md-3 col-sm-3 col-xs-3'
        },
        {
          'show_data': false,
          'desabilitar': false,
          'porcentagem_desconto': 'col col-lg-3 col-md-3 col-sm-3 col-xs-3',
          'valor_desconto': 'col col-lg-3 col-md-3 col-sm-3 col-xs-3'
        },
        {
          'show_data': true,
          'desabilitar': false,
          'porcentagem_desconto': 'col col-lg-2 col-md-2 col-sm-2 col-xs-2',
          'valor_desconto': 'col col-lg-2 col-md-2 col-sm-2 col-xs-2'
        }
    ];

    $scope.parametro = {};
    $scope.ocorrencia = {};
    $scope.cobranca_preco = {};


    $scope.error = '';  

    $scope.tipos_carnes = {};
    $scope.cobrancas_precos = {};
    $scope.tipos_receitas = [];
    $scope.tipo_receita = [];
    $scope.cursos = [];
    $scope.item_curso = [];

    $scope.verificarAcaoTipoReceita = function(item) {
      $scope.ocorrencia.id_tipo_receita = item.id; 
      $( "em[for='id_tipo_receita']" ).css("display","none"); 
    }

    $scope.verificarAcaoCobrancaPreco = function(item) {
      $scope.cobranca_preco.id_curso = item.id; 
      $( "em[for='id_curso']" ).css("display","none"); 
    }

    $scope.getTipoCarne = function(){
      $http.get('api/index.php/tipocarne/')
      .success(function(data, status, headers, config) {
        $scope.tipos_carnes = data.tipo_carne;
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.getTipoReceita = function(){
      $http.get('api/index.php/tiporeceita/')
      .success(function(data, status, headers, config) {
        $scope.tipos_receitas = data.tiporeceita;
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.getCobrancaPreco = function(id_prametro_cobranca_ocorrencia){
      $http.get('api/index.php/cobrancapreco/0/'+id_prametro_cobranca_ocorrencia)
      .success(function(data, status, headers, config) {
        $scope.cobrancas_precos = data.cobranca_preco;
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.getCurso = function(){
      $http.get('api/index.php/curso/1/')
      .success(function(data, status, headers, config) {
        $scope.cursos = data.curso;
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.getParametro = function(id){
      $http.get('api/index.php/parametrocobranca/'+id)
        .success(function(data, status, headers, config) {      
          $scope.parametro = data.parametro_cobranca[0];                   
          $scope.parametro.data_vencimento1 = $scope.parametro.data_vencimento;          
        })
        .error(function(data, status, headers, config) {}); 
    } 

    $scope.getOcorrencia = function(id){
      $http.get('api/index.php/parametrocobrancaocorrencia/0/'+id)
        .success(function(data, status, headers, config) {      
          $scope.ocorrencias = data.parametro_cobranca_ocorrencia; 
        })
        .error(function(data, status, headers, config) {}); 
    } 

    $scope.novoCadastro = function(){
      $scope.parametro = {};
      $scope.parametro.ativo = 1;
      $scope.parametro.desconto_especial = 0;

      $scope.class_porcentagem_desconto = classCol[0].porcentagem_desconto;
      $scope.class_valor_desconto = classCol[0].valor_desconto;
      $scope.show_data = classCol[0].show_data;
      $scope.desabilitar = classCol[0].desabilitar;
    }

    $scope.novoCadastroOcorrencia = function(){
      $scope.ocorrencia = {};
      $scope.ocorrencia.ativo = 1; 
      $scope.ocorrencia.receita_principal = false;
      $scope.ocorrencia.faixa_preco = false;
      $scope.ocorrencia.desconto_bolsa = false;
      $scope.ocorrencia.desconto_pontualidade = false;
      $scope.tipo_receita.selected = '';
    }

    $scope.novoCadastroCobrancaPreco = function(){
      var titulo = $scope.cobranca_preco.titulo;
      var id = $scope.cobranca_preco.id_prametro_cobranca_ocorrencia;

      $scope.cobranca_preco = {};
      $scope.cobranca_preco.ativo = 1;

      $scope.cobranca_preco.titulo = titulo;
      $scope.cobranca_preco.id_prametro_cobranca_ocorrencia = id;
      
      $scope.cobranca_preco.valor_normal = false;
      $scope.item_curso.selected = '';
    }

    $scope.modalNovoOcorrenciaPreco = function(item){
      $scope.novoCadastroCobrancaPreco();
      $scope.cobranca_preco.id_prametro_cobranca_ocorrencia = item.id;
      $scope.getCobrancaPreco(item.id);
      $scope.cobranca_preco.titulo = item.tipo_receita;
      $('#myModalOcorrenciaPreco').modal('show');        
    }

    $scope.editarOcorrencia = function(item){
      $scope.ocorrencia = item;
      $scope.tipo_receita = {selected: {id: item.id_tipo_receita, descricao: item.tipo_receita}};
    }

    $scope.editarCobrancaPreco = function(item){
      var titulo = $scope.cobranca_preco.titulo;
      var id = $scope.cobranca_preco.id_prametro_cobranca_ocorrencia;
      $scope.cobranca_preco = item;
      $scope.cobranca_preco.titulo = titulo;
      $scope.cobranca_preco.id_prametro_cobranca_ocorrencia = id;
      $scope.item_curso = {selected: {id: item.id_curso, nome: item.curso}};
    }

    $scope.cadastrarParametro = function() {  
      if ($('#cadastroParametro-form').valid()) {
        if($scope.parametro.desconto_especial >= 1 && ($scope.parametro.porcentagem_desconto == '' && $scope.parametro.valor_desconto == '')){
          Mensagem.error('É necessário preencher os campos: % de desconto ou Valor do desconto, os mesmos devem ter valores maiores que zero!');   
          return;
        }
        $scope.json = angular.toJson($scope.parametro);
                            
        $http.post('api/index.php/parametrocobranca/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              $scope.parametro.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.cadastrarOcorrencia = function() {  
      if ($('#cadastroOcorrencia-form').valid()) {
        $scope.ocorrencia.id_parametro_cobranca = $scope.parametro.id;
        $scope.json = angular.toJson($scope.ocorrencia);

        $http.post('api/index.php/parametrocobrancaocorrencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              $scope.novoCadastroOcorrencia();

              $scope.getOcorrencia($scope.parametro.id);
            
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.adicionarCobrancaPreco = function() {  
      if ($('#cadastroOcorrenciaPreco-form').valid()) {
        $scope.json = angular.toJson($scope.cobranca_preco);
                            
        $http.post('api/index.php/cobrancapreco/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              $scope.novoCadastroCobrancaPreco();

              var id = $scope.cobranca_preco.id_prametro_cobranca_ocorrencia;
              $scope.getCobrancaPreco(id);
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    } 

    $scope.delCobrancaPreco = function(indice, item){
      $scope.json = angular.toJson(item);
                            
      $http.post('api/index.php/delcobrancapreco/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
         if (data.error == '0'){   
            Mensagem.success(data.mensagem);
            $scope.cobrancas_precos.splice(indice, 1);
            $scope.novoCadastroCobrancaPreco();
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
    }

    $scope.delParametroCobrancaOcorrencia = function(indice, item){
      $scope.json = angular.toJson(item);
                            
      $http.post('api/index.php/delparametrocobrancaocorrencia/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
         if (data.error == '0'){   
            Mensagem.success(data.mensagem);
            $scope.ocorrencias.splice(indice, 1);
            $scope.novoCadastroOcorrencia();
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
    }

    $scope.$watch('parametro.desconto_especial', function(){  
      $scope.show_data = classCol[$scope.parametro.desconto_especial].show_data;
      $scope.class_porcentagem_desconto = classCol[$scope.parametro.desconto_especial].porcentagem_desconto;
      $scope.class_valor_desconto = classCol[$scope.parametro.desconto_especial].valor_desconto;
      $scope.desabilitar = classCol[$scope.parametro.desconto_especial].desabilitar;

      if($scope.parametro.desconto_especial == 0 || $scope.parametro.desconto_especial == 1){
        //$scope.parametro.data_fixa_desconto1 = '';
        $scope.parametro.data_fixa_desconto = '';
      }

      if($scope.parametro.desconto_especial == 0){
        $scope.parametro.porcentagem_desconto = '';
        $scope.parametro.valor_desconto = '';
      }

    });

    $scope.$watch('parametro.data_vencimento', function(){  
      $scope.parametro.data_vencimento1 = $scope.parametro.data_vencimento;     
      if($scope.parametro.data_vencimento1 != undefined || $scope.parametro.data_vencimento1 != null){              
        $( "em[for='data_vencimento']" ).css("display","none"); 
      }
    });
    /*
    $scope.$watch('parametro.data_fixa_desconto', function(){  
      $scope.parametro.data_fixa_desconto1 = $scope.parametro.data_fixa_desconto;     
      if($scope.parametro.data_fixa_desconto1 != undefined || $scope.parametro.data_fixa_desconto1 != null){              
        $( "em[for='data_fixa_desconto']" ).css("display","none"); 
      }
    });
    */

    $scope.$watch('parametro.mes_ano', function(){  
      $scope.parametro.mes_ano1 = $scope.parametro.mes_ano;     
      if($scope.parametro.mes_ano1 != undefined || $scope.parametro.mes_ano1 != null){              
        $( "em[for='mes_ano']" ).css("display","none"); 
      }
    });

    $scope.novoCadastro();
    $scope.novoCadastroOcorrencia();
    $scope.novoCadastroCobrancaPreco();

    $scope.getTipoCarne();
    $scope.getTipoReceita();
    $scope.getCurso();


    if (idParametro != undefined) {
      $scope.getParametro(idParametro);
      $scope.getOcorrencia(idParametro);
    }; 
});

//@ sourceURL=controller.formCadastroParametrosCobranca.js