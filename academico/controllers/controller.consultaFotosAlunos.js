app.registerCtrl('consultaFotosAlunos', function($scope, $http) {
/*
  $scope.alunos = [];
  $scope.turmas = [];
  $scope.table = false;


  $scope.getListaComboPessoaTurma = function(){
    $http.get('../api/index.php/listapessoaturma/').    
    success(function(data, status, headers, config) {
      if(data.error == 0){
        $scope.turmas = data.turma;
        console.log("FOTOS: TURMA", $scope.turmas)
      }
    }).
    error(function(data, status, headers, config) {
        // log error
      }); 
  }


  $scope.filtraTurma = function(turma){   
    $scope.alunos = {};
    
    $http.get('../api/index.php/listaalunoturma/' + turma.id_turma).    
    success(function(data, status, headers, config) {
      if(data.error == 0){
        //$scope.pessoa.nome = '';
        //$scope.pessoa.codigo = '';
        $scope.table = true;
        $scope.alunos = data.alunos;
      }
    }).
    error(function(data, status, headers, config) {
        // log error
      }); 
    
  }

  $scope.getPessoaExists = function(val) {
    return $http.get('../api/index.php/stringaluno?aluno=1&', {
      params: {
        string: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.pessoa;
    });
  };


  $scope.getMatriculaExists = function(val) {
    return $http.get('../api/index.php/stringmatricula?aluno=1&', {
      params: {
        string: val,
        sensor: false
      }
    }).then(function(response){   
      return response.data.pessoa;
    });
  };

  $scope.getPessoa = function(item, model, label){
    $scope.alunos = {};
    $http.get('../api/index.php/pessoa/' + item.id).    
    success(function(data, status, headers, config) {
      if(data.error == 0){
        console.log("RESULTADO DA BUSCA",data);
        $scope.table = true;
        $scope.alunos = data.pessoa;
      }
    }).
    error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getMatricula = function(item, model, label){
    $scope.alunos = {};
    $http.get('../api/index.php/pessoa/' + item.id).    
    success(function(data, status, headers, config) {
      if(data.error == 0){
        console.log("RESULTADO DA MATRICULA",data);
        $scope.table = true;
        $scope.alunos = data.pessoa;
      }
    }).
    error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getListaComboPessoaTurma();
  */
});