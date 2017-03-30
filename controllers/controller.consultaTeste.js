smartSig.registerCtrl('consultaTeste', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var user = Array();
    $scope.users = [];

    $scope.searchNome = '';

    $scope.getData = function(p){
      $http.get('api/index.php/allteste?p='+p).    
        success(function(data, status, headers, config) {                                 
          if (data.startIndex < data.registros) {
            $scope.getData(data.pagina);
          };
          
          user.push(data.data);
          $scope.users.push(data.data);
        }).
        error(function(data, status, headers, config) {
          // log error
      });      
    }

    $http.get('api/index.php/allteste').    
      success(function(data, status, headers, config) {                                 
        

        if (data.startIndex < data.registros) {
          $scope.getData(data.pagina)
        };
        
        user  = data.data;
        $scope.users.push(data.data);
        $scope.registros = data.registros;
        console.log($scope.registros);
        $scope.tabelaConsulta();
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.tabelaConsulta = function(){
      $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: {
              nome: ''       // initial filter
          },
          sorting: {
              nome: 'asc'     // initial sorting
          }
      }, {
          total: user.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(user, params.filter()) :
                      user;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      user;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
      });
    }

    $scope.disabled = undefined;

    $scope.enable = function() {
      $scope.disabled = false;
    };

    $scope.disable = function() {
      $scope.disabled = true;
    };

    $scope.clear = function() {
      $scope.socio.selected = undefined;
    };

    $scope.refreshSocios = function(objeto) {
      var params = {objeto: objeto, sensor: false};
      if (objeto.length >= 3) {
        return $http.get('api/index.php/stringallteste?string='+objeto,
          {params: params}
        ).then(function(response) {
            console.log(response.data['pessoa'])
            $scope.socios = response.data['pessoa']
        });  
      };
      
    };
});