
smartSig.registerCtrl('consultaResumo', function($scope, $http, $location, $filter, filterFilter, $timeout, Modulos, $routeParams, datepickerConfig) {
  
  $scope.percent = 0;

  $scope.options = {
          animate:{
              duration:2000,
              enabled:true
          },
          barColor:'#C6000B',
          scaleColor:false,
          lineWidth:10,
          lineCap:'circle',
          size:75
      };

  $scope.options2 = {
          animate:{
              duration:2000,
              enabled:true
          },
          barColor:'#356E35',
          scaleColor:false,
          lineWidth:10,
          lineCap:'circle',
          size:75
      };    

  $scope.resumo = {};
  $scope.selectedDays = [];
  $scope.selectedDate = {};

  var dateAsString = $filter('date')(new Date(), "yyyy-MM-dd");
  var now = $filter('date')(new Date(), "dd");

  $scope.carregar = function(){

    $http.get('api/index.php/resumofinanceiro/'+dateAsString).    
      success(function(data, status, headers, config) {                                 
        $scope.resumo  = data;

        console.log($scope.resumo);
         
        angular.forEach($scope.resumo.dias, function(value, key) {      
          $scope.selectedDays.push(moment().date(value).valueOf()) 
        });

        $scope.selectedDate = $scope.resumo.resumo[parseInt(now)];
        $scope.percent = ($scope.resumo.debitosRealizados*100)/$scope.resumo.debitos;    
        $scope.percent2 = ($scope.resumo.creditosRealizados*100)/$scope.resumo.creditos;    

        if($scope.resumo.despesaFixa > $scope.resumo.despesaFixa_anterior){
          $scope.percent3 = (($scope.resumo.despesaFixa+$scope.resumo.despesaFixa_anterior)*100)/$scope.resumo.despesaFixa;
        }else{
          $scope.percent3 = Math.abs((($scope.resumo.despesaFixa-$scope.resumo.despesaFixa_anterior)*100)/$scope.resumo.despesaFixa_anterior);
          $scope.percent3 = 100 - $scope.percent3;
        }

        if($scope.resumo.despesaVariavel > $scope.resumo.despesaVariavel_anterior){
          $scope.percent4 = (($scope.resumo.despesaVariavel+$scope.resumo.despesaVariavel_anterior)*100)/$scope.resumo.despesaVariavel;  
        }else{
          $scope.percent4 = Math.abs((($scope.resumo.despesaVariavel-$scope.resumo.despesaVariavel_anterior)*100)/$scope.resumo.despesaVariavel_anterior);
          $scope.percent4 = 100 - $scope.percent4;
        }

        if($scope.resumo.creditos > $scope.resumo.creditos_anterior){
          $scope.percent5 = (($scope.resumo.creditos-$scope.resumo.creditos_anterior)/ $scope.resumo.creditos)*100;
          $scope.percent5 = 100 - $scope.percent5;
        }else{
          $scope.percent5 = Math.abs((($scope.resumo.creditos-$scope.resumo.creditos_anterior)*100)/$scope.resumo.creditos_anterior);
          $scope.percent5 = 100 - $scope.percent4;
        }
        
      }).
      error(function(data, status, headers, config) {
        // log error
    });
  }
  $scope.carregar();


  $scope.logInfos = function(event, date) {
    event.preventDefault() // prevent the select to happen    
    //reproduce the standard behavior
    if(event.type == 'click') {      
      $scope.selectedDate = $scope.resumo.resumo[moment(date).format('DD')];
    } 
  }

  $scope.logMonthChanged = function(newMonth, oldMonth){

    //FRH -> Ver exemplo em: http://arca-computing.github.io/MultipleDatePicker/
    //alert('new month : ' + newMonth.format('YYYY-M-DD') + ' || old month : ' + oldMonth.format('YYYY-M-DD'));

    dateAsString = $filter('date')(new Date(newMonth.format('YYYY-M-DD')), "yyyy-MM-dd");
    now = $filter('date')(new Date(newMonth.format('YYYY-M-DD')), "dd");
    $scope.carregar();

  };

});
//@ sourceURL=controller.consultaResumo.js