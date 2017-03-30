
/*
  Módulo: Mesquita
  Descrição: CRUD Quadro associativo
  Método: POST
  URL: /form/formCAdastroQuadroAssociativo
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 10/02/2015
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 15/03/2015
  Autor: Ricardo S. Nakadomari
  Conforme item: XX do Kambanize
 */
smartSig.registerCtrl("formCadastroQuadroAssociativo", function($scope, $http, $routeParams, $filter, Mensagem, $timeout, Permissao){
/*
$scope.permissoes = Permissao.validaPermissao();
    
$scope.permissoes.then(function (data) {
    $scope.permissoes = data;
}, function (status) {
    console.log('status',status);
});
*/

$scope.periodo = {};
$scope.periodo.id = $routeParams.id;

$scope.addPeriodo = {};
$scope.addPeriodo.ativo = 1;
$scope.cargos = [];
$scope.addCargoAssociado = {}
$scope.cargoAssociado = {}

$scope.cargo = [];
$scope.associado = [];

$scope.pessoa = [];

$scope.$watch('addPeriodo.data_inicio', function(){  
  $scope.addPeriodo.data_inicio1 = $scope.addPeriodo.data_inicio;     
  if($scope.addPeriodo.data_inicio1 != undefined || $scope.addPeriodo.data_inicio1 != null){              
    $( "em[for='data_inicio']" ).css("display","none"); 
  }
});

$scope.$watch('addPeriodo.data_termino', function(){  
  $scope.addPeriodo.data_termino1 = $scope.addPeriodo.data_termino;
  if($scope.addPeriodo.data_termino1 != undefined || $scope.addPeriodo.data_termino1 != null){
     $( "em[for='data_termino']" ).css("display","none");
  }
});

$scope.getPessoa = function(){
  $http.get('api/index.php/pessoa/').        
    success(function(data, status, headers, config) {                           
      $scope.pessoa = data.pessoa;
  }).
  error(function(data, status, headers, config) {
      // log error
  }); 
}

$scope.getDepartamento = function(){
    $http.get('api/index.php/departamento/').
    success(function(data, status, headers, config) {
      $scope.departamentos = data.departamento;
    }).
    error(function(data, status, headers, config) {
      // log error
    });
}

$scope.getCargo = function(departamento){
  $http.get('api/index.php/cargo/0/0/'+departamento).        
    success(function(data, status, headers, config) {               
      $scope.cargos = data.cargo;
  }).
  error(function(data, status, headers, config) {
      // log error
  }); 
}

$scope.modalCargo = function(){
  $('#myModalCargo').modal('show');        
}

$scope.verificarAcaoCargo = function(item) {
  console.log('verificarAcaoCargo', item);
  if (item.id==-1) {
      $scope.modalCargo();
      $scope.cargo.selected = '';
  }
  $scope.addCargoAssociado.id_cargo = item.id;
  $( "em[for='id_cargo']" ).css("display","none");    
}

$scope.verificarAcaoAssociado = function(item) {
  $scope.addCargoAssociado.id_pessoa = item.id;
  $( "em[for='id_pessoa']" ).css("display","none");    
}

$scope.cadastrarPeriodo = function(periodo){
  if ($('#cadastroQuadroAssociativo-form').valid()) {
    if($scope.periodo.id != ''){
      periodo.id = $scope.periodo.id;
    }

    $scope.json = angular.toJson(periodo);
                          
    $http.post('api/index.php/quadroassociativo/', $scope.json, 
                  {withCredentials: true,
                  headers: {'enctype': 'multipart/form-data' },
    }).success(function(data, status, headers, config) {
       if (data.error == '0'){   
          $scope.periodo.id = data.id_quadro_associativo;
          
          Mensagem.success(data.mensagem); 
       }else{
          Mensagem.error(data.mensagem);   
       }
    }).error(function(data, status) { 
        
    });
  }
}

$scope.cadastrarCargoAssociado = function(cargo){
  if ($('#cadastroCargoAssociado-form').valid()) {
    verifica_cargo = Array();
    verifica_associado = Array();
    if($scope.cargoAssociado){
      verifica_cargo = $filter('filter')($scope.cargoAssociado, {id_cargo: cargo.id_cargo});
      verifica_associado = $filter('filter')($scope.cargoAssociado, {id_pessoa: cargo.id_pessoa});
    }
    
    if (verifica_cargo.length > 0 || verifica_associado.length > 0 ) {
       Mensagem.error("Este cargo ou o associado já foi cadastrado!");   
    }else{
      if($scope.periodo.id != ''){
        cargo.id_quadro_associativo = $scope.periodo.id;
      }
      
      $scope.json = angular.toJson(cargo);
                            
      $http.post('api/index.php/quadroassociativopessoa/', $scope.json, 
                    {withCredentials: true,
                    headers: {'enctype': 'multipart/form-data' },
      }).success(function(data, status, headers, config) {
         if (data.error == '0'){   
            //$scope.periodo.id = data.id_quadro_associativo;
            $scope.getQuadroAssociativoPessoa($scope.periodo.id);
            Mensagem.success(data.mensagem); 
            $scope.addCargoAssociado = {};
            
            $scope.cargo.selected = '';
            $scope.associado.selected = '';

         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
          
      });
    }
  }
}

$scope.cadastrarCargo = function(cargo){
  if ($('#cadastroCargo-form').valid()) {
    cargo.ativo = 1;
    $scope.json = angular.toJson(cargo);
                          
    $http.post('api/index.php/cargo/', $scope.json, 
                  {withCredentials: true,
                  headers: {'enctype': 'multipart/form-data' },
    }).success(function(data, status, headers, config) {
       if (data.error == '0'){   

          Mensagem.success(data.mensagem); 
          $scope.getCargo();
          $('#myModalCargo').modal('hide');  

       }else{
          Mensagem.error(data.mensagem);   
       }
    }).error(function(data, status) { 
        
    });
  }
}

$scope.delItem = function(indiceEl, item){
 
  $scope.json = angular.toJson(item);
                        
  $http.post('api/index.php/delquadroassociativopessoa/', $scope.json, 
                                 {withCredentials: true,
                                 headers: {'enctype': 'multipart/form-data' },
                                 }
  ).success(function(data, status, headers, config) {
      if (data.error == '0'){  

          Mensagem.success(data.mensagem);    
          
          $scope.cargoAssociado.splice(indiceEl,1);
      }else{              
        Mensagem.error(data.mensagem);   
      }
  }).error(function(data, status) { 
    
  });
}

$scope.getQuadroAssociativoPessoa = function(id){
  $http.get('api/index.php/quadroassociativopessoa/'+id).        
    success(function(data, status, headers, config) {                           
      $scope.cargoAssociado = data.quadro_associativo_pessoa;
  }).
  error(function(data, status, headers, config) {
    // log error
  }); 
}

$scope.getQuadroAssociativo = function(id){
  $http.get('api/index.php/quadroassociativo/'+id).    
  success(function(data, status, headers, config) {
    $scope.addPeriodo = data.quadro_associativo[0];
    $scope.getCargo(data.quadro_associativo[0].id_departamento)
    console.log('getQuadroAssociativo', $scope.addPeriodo);
  }).
  error(function(data, status, headers, config) {
    // log error
  });
}

$scope.novoCadastro = function(){
   $scope.addPeriodo = {};
   $scope.addPeriodo.ativo = 1;

   $scope.cargoAssociado = {};
   
   $scope.periodo.id = '';
}

$scope.limparCadastro = function(){
   $scope.addCargoAssociado = {};
            
   $scope.cargo.selected = '';
   $scope.associado.selected = '';
}

$scope.verificarAcaoDepartamento = function(objeto){
  $scope.cargo.selected = "";
  $scope.getCargo(objeto);
}

if($scope.periodo.id){
  $scope.getQuadroAssociativo($scope.periodo.id);
  $scope.getQuadroAssociativoPessoa($scope.periodo.id);
}
$scope.getPessoa();
$scope.getCargo();
$scope.getDepartamento();
});