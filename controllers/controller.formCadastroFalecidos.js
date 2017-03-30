smartSig.registerCtrl("formCadastroFalecidos", function($scope, $http, $routeParams, Mensagem, $filter, $timeout, Permissao){

	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
	});

	var idFalecido = $routeParams.id;

	$scope.falecido = {};
	$scope.endereco = {};
	$scope.estados = {};
	$scope.cidades = {}; 
	$scope.paises = {};   
	$scope.estadocivil = {}; 
	$scope.causamortis = []; 
	$scope.funeraria = {};
	$scope.quadra = {};
	$scope.lote = {};
	$scope.jazigo = {};
	$scope.gaveta = {};
	$scope.falecido.indigente = 0;
	$scope.files = '';   
	$scope.error = '';
	$scope.movimentacao = [];
	$scope.falecido.causa_mortis = [];

	$scope.filesArquivoDocumento = '';
	$scope.filesArquivoCPF = '';  
	$scope.falecido.certidao_obito = '';

	$scope.data_vencimento = '';

	$scope.estados = {};

	$scope.$watch('falecido.data_nascimento', function(){  
		$scope.falecido.data_nascimento1 = $scope.falecido.data_nascimento;     
		if($scope.falecido.data_nascimento1 != undefined || $scope.falecido.data_nascimento1 != null){              
			$("em[for='dataNascimento']").css("display","none"); 
		}
	});

	$scope.$watch('falecido.data_obito', function(){  
		$scope.falecido.data_obito1 = $scope.falecido.data_obito;     
		if($scope.falecido.data_obito1 != undefined || $scope.falecido.data_obito1 != null){              
			$("em[for='dataObito']").css("display","none"); 
		}
	});

	$scope.$watch('falecido.data_sepultamento', function(){  
		$scope.falecido.data_sepultamento1 = $scope.falecido.data_sepultamento;     
		if($scope.falecido.data_sepultamento1 != undefined || $scope.falecido.data_sepultamento1 != null){              
			$("em[for='data_sepultamento']").css("display","none"); 
		}
	});

	$scope.$watch('falecido.data_exumacao', function(){  
		$scope.falecido.data_exumacao1 = $scope.falecido.data_exumacao;     
		if($scope.falecido.data_exumacao1 != undefined || $scope.falecido.data_exumacao1 != null){              
			$("em[for='data_exumacao']").css("display","none"); 
		}
	});

	$scope.$watch('falecido.data_vencimento_gaveta', function(){  
		$scope.falecido.data_vencimento_gaveta1 = $scope.falecido.data_vencimento_gaveta;     
		if($scope.falecido.data_vencimento_gaveta1 != undefined || $scope.data_vencimento_gaveta1 != null){              
			$("em[for='data_vencimento_gaveta']").css("display","none"); 
		}
	});

	/*==============================================================================================================*/
	/*======================================== ROTINAS PARA CAUSA MORTIS ===========================================*/
	/*==============================================================================================================*/

	$scope.setarCausaMortisSelecionado = function(item, select) {
		if(item.length > 0){
			var nivel = item.length - 1;
			if(item[nivel].id==-1){
				$scope.modalNovoCausaMortis();          
				item.pop();
			}else{
				$scope.falecido.causa_mortis = item;
			}
		}
	}

	$scope.causamortis_uis=[];
	$scope.causamortis_uis.selecionados=[];

	$scope.refreshCausaMortis = function(falecido) {      
		$http.get('api/index.php/stringcausamortis').success(function(data, status, headers, config) {
			if(data[0].error != -1){
				$scope.causamortis = data;
				angular.forEach(data, function(value, key) {
					angular.forEach(falecido, function(value2, key2) {
						if(value.id == value2.id){                
							$scope.causamortis_uis.selecionados.push(data[key]);
						}
					});
				});
			}
		})
		.error(function(data, status, headers, config) {});      
	};

	$scope.modalNovoCausaMortis = function(size){
		$('#myModalCausaMortis').modal('show');
	}

	$scope.adicionarCausaMortis = function(){
		if ($('#cadastroCausaMortis-form').valid()) {

			$scope.addCausaMortis.ativo = 1;
			$scope.json = angular.toJson($scope.addCausaMortis);

			$http.post('api/index.php/causamortis/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){  
					Mensagem.success(data.mensagem);

					$('#myModalCausaMortis').modal('hide');

					$scope.refreshCausaMortis();
					$scope.addCausaMortis = {};                

				} else {              
					Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { });
		}
	}
	/* ************************************************************************************************************************* */

	$scope.getIdFalecido = function(){

		$http.get('api/index.php/falecido/'+idFalecido).    
		success(function(data, status, headers, config) {

			$scope.falecido = data.falecido[0];
			$scope.falecido.quadra = data.falecido[0].id_quadra;
			$scope.falecido.jazigo = data.falecido[0].id_unidade_armazenagem;
			$scope.data_vencimento = data.falecido[0].data_vencimento_gaveta;

			$scope.carregaLote($scope.falecido.id_quadra, data.falecido[0].id_lote);
			$scope.carregaJazigo(data.falecido[0].id_lote, $scope.falecido.jazigo);
			$scope.carregaGaveta($scope.falecido.jazigo, data.falecido[0].id_lote);


			if (data.falecido[0].causa_mortis) {
				$scope.refreshCausaMortis(data.falecido[0].causa_mortis);
			}          

			if ($scope.falecido.logradouro!=undefined) {
				$scope.getCep();
			}else{
				$scope.falecido.logradouro = {}      
			}
			SalvarFalecido.disabled = false;
		}).
		error(function(data, status, headers, config) {}); 
	}

	$scope.getCep = function(){

		$scope.estados = {};
		$scope.cidades = {};

		$http.get('api/index.php/cep/'+$scope.falecido.cep)
		.success(function(data, status, headers, config) {

			if(data[0].error == -1){
				$scope.getEstado();
				//$scope.error = data[0].mensagem;
				//Mensagem.error(data[0].mensagem);
			}
			else{
				$scope.falecido.cep         = data[0].endereco.cep;
				$scope.falecido.logradouro  = data[0].endereco.logradouro;
				$scope.falecido.bairro      = data[0].endereco.bairro;
				$scope.falecido.estado      = data[0].endereco.estado;
				$scope.falecido.cidade      = data[0].endereco.cidade;

				$scope.estados              = data[0].estados;
				var cidades_estado          = $filter('filter')(data[0].estados, {uf: $scope.falecido.estado});
				$scope.cidades              = cidades_estado[0].cidades; 
			}

			
		}).error(function(data, status, headers, config) {

		});
	}

	$scope.getEstado = function(){
		$http.get('api/index.php/estado/')
		.success(function(data, status, headers, config) {                           
			//$scope.cidades = data;
			$scope.estados = data;
		})
		.error(function(data, status, headers, config) { });
	}

	$scope.getCidade = function(uf){
		$http.get('api/index.php/cidade/'+uf)
		.success(function(data, status, headers, config) {                           
			$scope.cidades = data;
		})
		.error(function(data, status, headers, config) { });
	} 

	$scope.getPaises = function(){
		$http.get('api/index.php/pais').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.paises = data;
			}
		}).
		error(function(data, status, headers, config) {});
	}
	$scope.getPaises();

	$scope.getEstadoCivil = function(){

		$http.get('api/index.php/estadocivil/').    
		success(function(data, status, headers, config) {                           
			$scope.estados_civil = data.estado_civil;

		}).
		error(function(data, status, headers, config) {}); 
	} 

	$scope.getFuneraria = function(){

		$http.get('api/index.php/funeraria/').    
		success(function(data, status, headers, config) {                           
			$scope.funeraria = data.funeraria;

		}).
		error(function(data, status, headers, config) {
          // log error
      }); 
	}

	$scope.getQuadra = function(){
		$http.get('api/index.php/quadra/').
		success(function(data, status, headers, config) {                           
			$scope.quadra = data.quadra;
			if($scope.falecido.quadra != ""){
				$timeout(function() {
					$scope.falecido.id_quadra = parseInt($scope.falecido.quadra);           
				}, 1500);
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      }); 
	}

	$scope.carregaLote = function(id_quadra, id_lote){

		$http.get('api/index.php/carregaquadralote/'+id_quadra).    
		success(function(data, status, headers, config) {
			$scope.lote = data.lote;
			if(id_lote == ""){
				$timeout(function() {
					$scope.falecido.id_lote = parseInt(id_lote);            
				}, 1500);
			}          


		}).
		error(function(data, status, headers, config) {
          // log error
      }); 
	}

	$scope.carregaJazigo = function(id_lote, id_jazigo){

		$http.get('api/index.php/jazigo/'+id_lote).    
		success(function(data, status, headers, config) {                           
			$scope.jazigo = data.jazigo;
			if(id_jazigo == ""){
				$timeout(function() {
					$scope.falecido.id_unidade_armazenagem = parseInt(id_jazigo)            
				}, 1500);
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      }); 
	} 

	$scope.carregaGaveta = function(id_jazigo, id_gaveta){
		$http.get('api/index.php/gaveta/1/'+id_jazigo).    
		success(function(data, status, headers, config) {                           
			$scope.gaveta = data.gaveta;
		}).
		error(function(data, status, headers, config) {
          // log error
      }); 

        //console.log('Gaveta', $scope.falecido.id_gaveta);
    }


    function convertDate(inputFormat) {
    	function pad(s) { return (s < 10) ? '0' + s : s; }
    	var d = new Date(inputFormat);
    	return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    $scope.cadastrarFalecido = function(objeto) {

    	if ($('#cadastroFalecidos-form').valid()) {

    		if(idFalecido != null){
    			var array_dt_vencimento = $scope.data_vencimento.split("T");
    			var data_vencimento = convertDate(array_dt_vencimento);
    			var data_vencimento_gaveta = convertDate($scope.falecido.data_vencimento_gaveta);
    			if(data_vencimento == data_vencimento_gaveta && $scope.falecido.data_exumacao != null){
    				Mensagem.error("Por favor, altere a data de vencimento da gaveta");
    				return;
    			}
    		}

    		$scope.json = angular.toJson($scope.falecido);

    		$http.post('api/index.php/falecido/', $scope.json, 
    			{withCredentials: true,
    				headers: {'enctype': 'multipart/form-data' },
    			}
    			).success(function(data, status, headers, config) {
    				if (data.error == '0')
    				{                
    					idFalecido = data.id_falecido; 
    					$scope.objeto = {};

    					if($scope.files != ''){
    						$scope.uploadFile($scope.files, data.id_falecido);
    					}

              //=============================================================
              // Upload dos arquivos 
              //=============================================================

              parm_id = data.id_falecido;
              parm_dir = 'falecido';

              parm_files = $scope.filesArquivoDocumento;
              parm_tipo = 0;

              if ($scope.filesArquivoDocumento != '' && data.id_falecido) {
              	$scope.upArquivos(parm_id, parm_files, parm_dir, parm_tipo);
              }
              
              parm_files = $scope.filesArquivoCPF;              
              parm_tipo = 1;

              if ($scope.filesArquivoCPF != '' && data.id_falecido) {
              	$scope.upArquivos(parm_id, parm_files, parm_dir, parm_tipo);
              }
              //=============================================================


              Mensagem.success(data.mensagem);   

              $scope.falecido = {};
              $scope.falecido.indigente = 0;
              SalvarFalecido.disabled = true; 
              $scope.getFalecidoMovimentacao();
              }
              else
              {
              	Mensagem.error(data.mensagem);   
              }
          }).error(function(data, status) { 

          });
      }

  }

  $scope.armazenaFile = function(files) {
  	$scope.files = files;               
  }; 

  $scope.armazenaArquivoDocumento = function(files) {
  	$scope.filesArquivoDocumento = files;
  };

  $scope.armazenaArquivoCPF = function(files) {
  	$scope.filesArquivoCPF = files;
  };

  $scope.upArquivos = function(id,files,dir,tipo) {

  	var fd = new FormData();
  	file = files.files[0];

  	if(file){   
  		fd.append("file", file);
  		$http.post('api/index.php/uparquivos/'+id+'/'+dir+'/'+tipo, fd, { withCredentials: true, headers: {'Content-Type': undefined }, transformRequest: angular.identity})
  		.success(function(data, status, headers, config) {

  			if(data.error == -1){ Mensagem.error(data.mensagem); }
  		else{ /*Mensagem.success(data.mensagem);*/ }
  	})
  		.error(function(data, status) {});
  	}
  }

  $scope.uploadFile = function(files,id) {

  	var fd = new FormData();

  	file = files.files[0];

  	if(file){
  		fd.append("file", file);

  		$http.post('api/index.php/uploadfilefalecido/'+id, fd, {
  			withCredentials: true,
  			headers: {'Content-Type': undefined },
  			transformRequest: angular.identity
  		}).success(function(data, status, headers, config) {
              //console.log(data);
          }).error(function(data, status) { 

          });
      }
  };

  $scope.getFalecidoMovimentacao = function(){
  	$http.get('api/index.php/falecidomovimentacao/'+idFalecido).    
  	success(function(data, status, headers, config) {
  		$scope.movimentacao = data;

  	}).
  	error(function(data, status, headers, config) {
          // log error
      });       
  }

  $scope.novoCadastro = function(){
  	$scope.falecido = {};
  	$scope.falecido.indigente = 1;
  	$scope.endereco = {};
  	$scope.estados = {};
  	$scope.cidades = {}; 
  	$scope.paises = {};   
  	$scope.quadra = {};
  	$scope.lote = {};
  	$scope.jazigo = {};
  	$scope.gaveta = {};
  	$scope.files = '';   
  	$scope.movimentacao = [];

  	$('#arquivo_documento').val('');
  	$('#arquivo_cpf').val('');
  	SalvarFalecido.disabled = true;

      //$scope.causamortis_uis=[];
      //$scope.causamortis_uis.selecionados=[];

      $scope.causamortis = {};
      $scope.getcausamortis();
  }

    //Inicializa Combos
    $scope.getEstado();
    $scope.getQuadra();

    $scope.getEstadoCivil();        
    $scope.getFuneraria();
    //$scope.getFalecidoMovimentacao();

    if (idFalecido != undefined) {
    	$scope.getIdFalecido();
    	$scope.getFalecidoMovimentacao();      
    }; 

     //console.log('Primeira olhada',$scope.falecido);


 });
//@ sourceURL=controller.formCadastroFalecidos.js