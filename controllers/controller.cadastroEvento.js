smartSig.registerCtrl('cadastroEvento', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $compile, uiCalendarConfig, $timeout, $routeParams, Mensagem, Permissao) {
  
  $scope.permissoes = Permissao.validaPermissao();
    
  $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
  }, function (status) {
      console.log('status',status);
  }); 

	$scope.agenda = {};
	$scope.eventoata = {};
	$scope.eventoagenda = {};
	$scope.agendasSel = [];

	var idEvento = $routeParams.id;

	console.log("IdEvento", idEvento);

	$scope.initEvento = function(){		
		$scope.agenda.color = 'bg-color-darken';
		$scope.agenda.icon = 'fa-user';
		//$scope.agenda.titulo = 'Dia das crianças';
		//$scope.agenda.descricao = 'União dos filhos dos associados para comemorar o dia das crianças'
		var data = [{nome: "Moroni", idade: 50},
	                {nome: "Tiancum", idade: 43},
	                {nome: "Jacob", idade: 27},
	                {nome: "Nephi", idade: 29},
	                {nome: "Enos", idade: 34},
	                {nome: "Tiancum", idade: 43},
	                {nome: "Jacob", idade: 27},
	                {nome: "Nephi", idade: 29},
	                {nome: "Enos", idade: 34},
	                {nome: "Tiancum", idade: 43},
	                {nome: "Jacob", idade: 27},
	                {nome: "Nephi", idade: 29},
	                {nome: "Enos", idade: 34},
	                {nome: "Tiancum", idade: 43},
	                {nome: "Jacob", idade: 27},
	                {nome: "Nephi", idade: 29},
	                {nome: "Enos", idade: 34}];

	    $scope.tableParams = new ngTableParams({
	        page: 1,            // show first page
			count: 10,          // count per page
			filter: {
			  nome: ''       // initial filter
			},
			sorting: {
			  nome: 'asc'     // initial sorting
			}         // count per page
	    }, {
	        total: data.length, // length of data
	          getData: function($defer, params) {
	              // use build-in angular filter
	              var filteredData = params.filter() ?
	                      $filter('filter')(data, params.filter()) :
	                      data;
	              var orderedData = params.sorting() ?
	                      $filter('orderBy')(filteredData, params.orderBy()) :
	                      data;

	              params.total(orderedData.length); // set total for recalc pagination
	              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
	          }
	    });
	}

    $scope.getTipoEvento = function(){

        $http.get('api/index.php/ctipoevento/').    
        success(function(data, status, headers, config) {                           
          $scope.tipoevento = data.tipoevento;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 	

    $scope.getDepartamento = function(){

        $http.get('api/index.php/departamento/').    
        success(function(data, status, headers, config) {                           
          $scope.departamento = data.departamento;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 	    

	$scope.eventColor = function(value){    	
    	$scope.agenda.color = value;
    }

    $scope.eventIcon = function(value){    	
    	$scope.agenda.icon = value;
    }
	
	$scope.addEvento = function(agenda){
		//$scope.evento.push(agenda);
		console.log(agenda);
		console.log($scope.agenda);
	}

	$scope.getTipoEvento();
	$scope.getDepartamento();


    if (idEvento != undefined) {
      $timeout(function() {
        $scope.getIdEvento(idEvento);
      }, 800);  
      $timeout(function() {
        $scope.getIdAta(idEvento);
      }, 800);
      $timeout(function() {
        $scope.getIdAgendaEvento(idEvento);
      }, 800);                   
    }; 	


    $scope.getIdEvento = function(){
      $http.get('api/index.php/evento/'+idEvento).    
        success(function(data, status, headers, config) {      
          $scope.agenda = data[0]; 
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }   

    $scope.getIdAta = function(){
      $http.get('api/index.php/ata/'+idEvento).    
        success(function(data, status, headers, config) {      
          $scope.eventoata = data[0]; 

          $('.summernote').code(data[0].ata);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getIdAgendaEvento = function(){
      $http.get('api/index.php/agendaevento/'+idEvento).    
        success(function(data, status, headers, config) { 

          $scope.agendasSel = data.agenda; 

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }                

  $scope.cadastrarEvento = function(agenda) {      

    if ($('#cadastroEvento-form').valid()) {

      $scope.json = angular.toJson($scope.agenda);

      $http.post('api/index.php/evento/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
         if (data.error == '0')
         {
		        agenda.id = data.id_evento;
            Mensagem.success(data.mensagem); 
         }
         else
         {
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) {  });
    }
  } 

	$scope.cadastrarAta = function(ata) {      

       // if ($('#cadastroEvento-form').valid()) {
       	var aHTML = $('.summernote').code();

		$scope.eventoata.ata = aHTML;
		$scope.eventoata.id_evento = $scope.agenda.id;

          $scope.json = angular.toJson($scope.eventoata);

          $http.post('api/index.php/ata/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         // transformRequest: angular.identity
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {   

				$scope.eventoata.id = data.id_ata; 

                Mensagem.success(data.mensagem);  
                
             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });

    }    

	$scope.cadastrarEventoAgenda = function(eventoagenda) {      

        if ($('#cadastroEventoAgenda-form').valid()) {

          $scope.eventoagenda.id_evento = $scope.agenda.id;

          $scope.eventoagenda.horario = $scope.eventoagenda.horarioinicio + " às " + $scope.eventoagenda.horariofim;

          $scope.json = angular.toJson($scope.eventoagenda);

          $http.post('api/index.php/agendaevento/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {   

				eventoagenda.id = data.id_evento_agenda; 
				$scope.getIdAgendaEvento();
				$scope.eventoagenda = {};

                Mensagem.success(data.mensagem);  
                
             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) {  });
      }

    }   

    $scope.excluirAgenda = function(indexEl, item) {
      
      $scope.json = angular.toJson(item);
            
      $http.post('api/index.php/delAgendaEvento/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {    
        $scope.getIdAgendaEvento();   
        $scope.eventoagenda = {};             
      }).
      error(function(data, status, headers, config) { });       
    }    

    $scope.editarAgenda = function(indexEl, item) {
      
      $scope.eventoagenda.id = item.id;
      $scope.eventoagenda.titulo = item.titulo;
      $scope.eventoagenda.horarioinicio = item.horario.substr(0,5);
      $scope.eventoagenda.horariofim = item.horario.substr(9,5);
      
    }                 
    
});

//@ sourceURL=controller.cadastroEvento.js