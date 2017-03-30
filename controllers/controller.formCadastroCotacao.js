
smartSig.registerCtrl('cadastroCotacao', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem, $modal) {

  $scope.permissoes = Permissao.validaPermissao();

  $scope.permissoes.then(function (data) {
    $scope.permissoes = data;
  }, function (status) {
    console.log('status',status);
  });

  $scope.css = 'glyphicon glyphicon-chevron-up link';

  $scope.fornecedores = [];

  $scope.itens_fornecedores = {};

  $scope.cotacaoSelected = [];

  $scope.valorUnitario = [];

  $scope.id_cotacao = {};

  $scope.id_cotacao_compra = [];

  $scope.cotacoes = [];

  var objeto = Array(); 

  // angular.forEach($scope.cotacoes, function(value, key) {        
  //   $scope.cotacoes[key].classe = 'glyphicon glyphicon-chevron-up link';      
  // });

  $scope.getListaCotacao = function(){
    $http.get('api/index.php/cotacaolista').    
    success(function(data, status, headers, config) {                                 
     $scope.cotacoes = data;
     console.log("COTAÇÕES ",$scope.cotacoes);
     $scope.cotacaoSelected = [];
         //console.log($scope.cotacoes);
       }).
    error(function(data, status, headers, config) {
        // log error
      });
  }

  // $scope.abre = function(index){

  //   $scope.show = true;

  //   $scope.click = true;

  //   $scope.cotacaoSelected = $scope.cotacoes[index];

  //   $scope.getCotacaoCompraItensFornecedor($scope.cotacaoSelected.id);

    
  //   angular.forEach($scope.cotacoes, function(value, key) {                
  //     if ($scope.cotacoes[key] != index) {
  //       $scope.cotacoes[key].toggle = false;
  //       $scope.cotacoes[key].classe = 'glyphicon glyphicon-chevron-up link';
  //     }
  //   });

  //   if ($scope.cotacoes[index].toggle == true) {
  //     $scope.cotacoes[index].toggle = false;
  //     $scope.cotacoes[index].classe = 'glyphicon glyphicon-chevron-up link';
  //   }else{
  //     $scope.cotacoes[index].toggle = true;
  //     $scope.cotacoes[index].classe = 'glyphicon glyphicon-chevron-down link';
  //   };

  // }

  $scope.getCotacaoCompraItensFornecedor = function(id){

    $http.get('api/index.php/cotacaocompraitensfornecedor/'+id).    
    success(function(data, status, headers, config) {
      if (data) {      
      };  
    }).
    error(function(data, status, headers, config) {
        // log error
      });
  } 

  $scope.enviarAprovacao = function(){
    //console.log($scope.cotacaoSelected.id);
    console.log($scope.cotacaoSelected.items);

    var i = 0;

    angular.forEach($scope.cotacaoSelected.items, function(value, key) {      
      angular.forEach($scope.cotacaoSelected.items[key].fornecedores, function(value2, key2) {
        console.log(key + ': ' + key2 + ': ' + value2.valor_unitario);
        if (value2.valor_unitario == '' || value2.valor_unitario == null) {
          i = i + 1;
        };
        
      });
    });
    if(i > 0){
      Mensagem.error("Todas as cotações devem ser incuídas.");
    }
    else{
      var objeto = {'id': $scope.cotacaoSelected.id};
      $scope.json = angular.toJson(objeto);
      $http.post('api/index.php/updatecotacaocompra/', $scope.json, 
        {withCredentials: true,
          headers: {'enctype': 'multipart/form-data' },
        }
        ).success(function(data, status, headers, config) {
          if (data.error == '0'){             
           Mensagem.success(data.mensagem);
           $scope.getListaCotacao();
         }
         else{
           Mensagem.error(data.mensagem);   
         }
       }).error(function(data, status) { 

       });
     }

     $scope.click = false;
   }

   $scope.modalEnviar = function(){
        $.SmartMessageBox({
          title : "Aprovação",
          content : "Deseja enviar as cotações para aprovaçao?",
          buttons : "[Sim][Não]",
          placeholder : ""
        }, function(ButtonPress, Value) {
          if (ButtonPress == "Sim") {
            $scope.enviarAprovacao();
            return 0;
          }else{
            return 0;  
          }
        });
      }

  $scope.cadastraCotacao = function(id, valor, quantidade){

   var objeto = {'id': id,'valor_unitario': valor,'valor_total': valor * quantidade, 'cotacao_compra': $scope.cotacaoSelected.id};

   $scope.json = angular.toJson(objeto);

   $http.post('api/index.php/cadastracotacaolista/', $scope.json, 
    {withCredentials: true,
      headers: {'enctype': 'multipart/form-data' },
    }
    ).success(function(data, status, headers, config) {
      if (data.error == '0'){             
       Mensagem.success(data.mensagem);
     }
     else{
       Mensagem.error(data.mensagem);   
     }
   }).error(function(data, status) { 

   });
 }

 $scope.getListaCotacao();
});