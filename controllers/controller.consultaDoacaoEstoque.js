
  smartSig.registerCtrl("consultaDoacaoEstoque", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.select_tipodoacao  = [];
    $scope.select_local       = [];
    $scope.select_status      = [];    

    $scope.regst = {};
    $scope.regan = {};
    $scope.doacao_estoque_sintetico = [];
    $scope.doacao_estoque_analitico = [];

    $scope.doacaoestoque = {};
    $scope.doacaoestoque.tipo = 0;

    $scope.getTipoDoacao = function(){    
      $http.get('api/index.php/tipodoacao/1/')
      .success(function(data, status, headers, config){
        if (data.error == 0) {
          $scope.select_tipodoacao = data.tipo_doacao;
          $scope.select_tipodoacao.push({'ativo': "1", 'descricao': 'Todos', 'id': '0', 'status': 'Ativo', 'tipo': 'Tipo de Doação'});
          $scope.itemtd = {selected : {'id':'0', 'descricao':'Todos'}};
        };
      })
      .error(function(data, status, headers, config) {});
    }
    
    $scope.getLocal = function(){    
      $http.get('api/index.php/localarmazenamentodoacao/1/')
      .success(function(data, status, headers, config){
        if (data.error == 0) {
          $scope.select_local = data.local_armazenamento_doacao;
          $scope.select_local.push({'ativo': '1', 'descricao': "Todos", 'id': "0", 'status': 'Ativo', 'tipo': 'Local de Armazenamento de Doação'});
          $scope.itemla = {selected : {'id':'0', 'descricao':'Todos'}};
        };          
      })
      .error(function(data, status, headers, config) {});
    }

    $scope.getDoacoesEstoque = function(idTipoDoacao,idlocalArmazenamento,status){

      $http.get('api/index.php/doacoesestoque/'+idTipoDoacao+'/'+idlocalArmazenamento+'/'+status)
      .success(function(data, status, headers, config){
        console.log('ESTOQUES', data);
        if (data.error == 0) {
          $scope.doacao_estoque_sintetico = data.doacao_estoque_sintetico;
          $scope.doacao_estoque_analitico = data.doacao_estoque_analitico;
        };          
      })
      .error(function(data, status, headers, config) {});
    }

    $scope.getStatus = function(){    

      $scope.select_status = [{'tipo':'Status','status':'Ativo'  ,'id':'1'},
                              {'tipo':'Status','status':'Inativo','id':'2'},
                              {'tipo':'Status','status':'Todos'  ,'id':'0'}];
      $scope.itemst = {selected : {'id':'0', 'status':'Todos'}};      
    }

    $scope.getTipoDoacao();
    $scope.getLocal();
    $scope.getStatus();

    $scope.verificarAcao = function(tipo,item){

      switch(tipo) {

          case 0: $scope.insel_tipodoacao.itemtd = item.id;
                  $("em[for='itemtd']").css("display","none");
                  break;

          case 1: $scope.insel_local.itemla = item.id;
                  $("em[for='itemla']").css("display","none");
                  break;

          case 2: $scope.insel_status.itemst = item.id;
                  $("em[for='itemst']").css("display","none");
                  break;
      }
    } 

    $scope.consultaEstoque = function(){

      switch(parseInt($scope.doacaoestoque.tipo)){
        case 0: 
                $scope.showRelatorio = 0; 
                
                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.sort = { active: 'doacao', descending: undefined }
                break;
        case 1: 
                $scope.showRelatorio = 1; 

                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.sort = { active: 'doacao', descending: undefined }
                break;
      }

      $scope.getDoacoesEstoque($scope.itemtd.selected.id,$scope.itemla.selected.id,$scope.itemst.selected.id);
    }

    $scope.gerarSinteticoPDF = function(){
      var link = document.createElement("a");
      link.setAttribute("href", 'api/index.php/relatoriosintetico/'+$scope.itemtd.selected.id+'/'+$scope.itemla.selected.id+'/'+$scope.itemst.selected.id);
      link.click();
    }

    $scope.gerarAnaliticoPDF = function(){
      var link = document.createElement("a");
      link.setAttribute("href", 'api/index.php/relatorioanalitico/'+$scope.itemtd.selected.id+'/'+$scope.itemla.selected.id+'/'+$scope.itemst.selected.id);
      link.click();
    }

    $scope.sort = {};

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
            sort.descending = !sort.descending;    
        } else {
            sort.active = column;
            sort.descending = false;
        }
    }

    $scope.getIcon = function(column) {        
        var sort = $scope.sort;        
        if (sort.active == column) {
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }
  });

//@ sourceURL=controller.consultaDoacaoEstoque.js