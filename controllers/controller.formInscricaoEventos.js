smartSig.registerCtrl('formInscricaoEventos', function($scope, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.evento = {}
    $scope.evento.ativo = 1;
    $scope.inscricao = {};
    $scope.inscricao.isento=0;
    $scope.inscricao.pago=0;
    $scope.ie = [];
    $scope.formapagamento = [];

    $scope.agenda = {};
    $scope.pessoa = {};
   
    var idEvento = $routeParams.id;

    $scope.searchNome = '';

    $scope.inscricao_evento = [];

    $scope.refreshSocios = function(objeto) {
  		var params = {
  			objeto: objeto,
  			sensor: false
  		};
  		if (objeto.length < 0) {
  			objeto = "a";
  		};
  		return $http.get('api/index.php/stringpessoa?associado=1&string=' + objeto, {
  			params: params
  		}).then(function(response) {
  			$scope.socios = response.data['pessoa']
  			console.log($scope.socios);
  		});
  	};

    $scope.changeRecebido = function(obj){     
      $scope.inscricao.id_pessoa = obj.id;
      $( "em[for='recebidopago']" ).css("display","none");      
    }

	 $scope.getFormaPagamento = function(){

        $http.get('api/index.php/formapagamento/').    
        success(function(data, status, headers, config) {                           
          $scope.formapagamento = data.forma_pagamento;
          console.log($scope.formapagamento);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.socios = [];

    $scope.addInscricaoEvento = function(objeto){
        $scope.socios.id = objeto.id;
    }

    $scope.salvarSocios = function(socio){
        //console.log($scope.socios.id);
    }

    $scope.getIdEvento = function(){

      $http.get('api/index.php/evento/'+idEvento).    
        success(function(data, status, headers, config) {      
          $scope.agenda = data[0];

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getInscritos = function(){

      $http.get('api/index.php/inscricaoevento/'+idEvento).    
        success(function(data, status, headers, config) {             
          $scope.inscricao_evento = data.inscricao_evento;  
          //console.log('inscritos',$scope.inscricao_evento);
          angular.forEach($scope.inscricao_evento, function(value, key) {
            console.log(key + ': ' + value.id_forma_pagamento);

          });       
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.ajustarIsento = function(i) {   
      //Se Isento=true, Forma de pagamento e Pago = false

      if ($scope.inscricao_evento[i].isento==true)
      {
        $scope.inscricao_evento[i].pagodisabled = false;
        $scope.inscricao_evento[i].id_forma_pagamentodisabled = false;
      } else {
        $scope.inscricao_evento[i].pagodisabled = true;
        $scope.inscricao_evento[i].id_forma_pagamentodisabled = true;       
      }
    }

    $scope.ajustarIsentoForm = function(objeto,valor) {
      console.log(objeto,valor);

      if (valor==1) {
        $scope.inscricao.pagodisabled=true;
        $scope.inscricao.id_forma_pagamentodisabled=true;
      } else {
        $scope.inscricao.pagodisabled=false;
        $scope.inscricao.id_forma_pagamentodisabled=false;
      }
    }

    $scope.ajustarPago = function(i) {   
      //Se Pago=true, Isento=False

      if ($scope.inscricao_evento[i].pago==true)
      {
        $scope.inscricao_evento[i].isentodisabled = false;        
      } else {
        $scope.inscricao_evento[i].isentodisabled = true;
      }
    } 

    $scope.ajustarPagoForm = function(objeto,valor) {
      console.log(objeto,valor);

      if (valor==1) {
        $scope.inscricao.isentodisabled=true;
      } else {
        $scope.inscricao.isentodisabled=false;
      }
    }       
    
    $scope.editarConta = function($index,objeto,agenda) {

       /* console.log($index);

        console.log("Objeto:",objeto);
        console.log("Agenda", agenda);

        console.log("index:",$scope.inscricao_evento[$index]);

       console.log($scope.inscricao_evento[$index].id_forma_pagamento);*/

       //$scope.ie.isento[0].disabled = true;

       if (($scope.inscricao_evento[$index].id_forma_pagamento==null) && ($scope.inscricao_evento[$index].isento==false))
       {
          Mensagem.error("Por favor, selecione a forma de pagamento ou selecione a opção de isento de pagamento");          

          return;          
       } 
   
        $scope.inscricao_evento[$index].flag = 1;
        $scope.inscricao_evento[$index].data_evento = agenda.data_evento;
        $scope.inscricao_evento[$index].title = agenda.title;
        $scope.inscricao_evento[$index].valor = agenda.valor;

        $scope.json = angular.toJson($scope.inscricao_evento[$index]);

        $http.post('api/index.php/inscricaoevento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {               
              Mensagem.success(data.mensagem);    
              $scope.getInscritos();
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        }); 

    } 

    $scope.setarIsento = function($index) {
        console.log($index);
        //console.log(inscricao_evento[$index]);          
    }

    $scope.salvarInscricao = function(inscricao,agenda) {

        if ($('#cadastroInscricaoEventos-form').valid()) {

          $scope.inscricao.id_evento = agenda.id;
          $scope.inscricao.id_pessoa = inscricao.id_pessoa;
          $scope.inscricao.flag = 1;
          $scope.inscricao.data_evento = agenda.data_evento;
          $scope.inscricao.title = agenda.title;
          $scope.inscricao.valor = agenda.valor;

          $scope.json = angular.toJson($scope.inscricao);

          $http.post('api/index.php/inscricaoevento/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {               
                Mensagem.success(data.mensagem);    
                $scope.getInscritos();
                $scope.inscricao = {};
                $scope.pessoa  = {};
                $scope.pessoa.selected = '';
                $scope.inscricao.isento=0;
                $scope.inscricao.pago=0;              
             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });  
        }   
    }

    $scope.currentPage = 1;
    $scope.pageSize = 20;    

    $scope.sort = {        
        active: 'nome',
        descending: undefined
    } 

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
            sort.descending = !sort.descending;    
        } else {
            sort.active = column;
            sort.descending = false;
        }
    };

    $scope.getIcon = function(column) {                     
        var sort = $scope.sort;        
        if (sort.active == column) {
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }    

    $scope.getFormaPagamento();       

    if (idEvento != undefined) {
      $timeout(function() {
        $scope.getIdEvento(idEvento);
      }, 800); 
      $timeout(function() {

        $scope.getInscritos(idEvento);
      }, 800);        
    };    

});