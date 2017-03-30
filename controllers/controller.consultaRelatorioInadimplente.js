smartSig.registerCtrl("consultaRelatorioInadimplente", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

  $scope.permissoes = Permissao.validaPermissao();
    
  $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
  }, function (status) {
      console.log('status',status);
  });

  $scope.pessoa = {};
  $scope.inadimplente = {};

  $scope.novoCadastro = function(){
    $scope.inadimplente = {};
    $scope.inadimplente.apresentar = 0;
  }

  $scope.gerarRelatorio = function(){
    if ($('#consultaRelatorioInadimplente-form').valid()) {

      var id_pessoa = '';
      if(typeof $scope.inadimplente.nome !== 'undefined' && $scope.inadimplente.apresentar == 1){
        if($scope.inadimplente.nome != ''){
          id_pessoa = $scope.inadimplente.nome;
        }
      }
    
      var link = document.createElement("a");
      link.setAttribute("href", 'api/index.php/relatorioinadimplente/'+id_pessoa);
      link.setAttribute("target", "_blank");
      link.click();  
    }
  }

  $scope.getPessoaExists = function(val) {
    $scope.inadimplente.nome = '';
    $( "em[for='inadimplente_nome']" ).css("display","none");  

    return $http.get('api/index.php/stringpessoa?todos=1&', {
      params: {
        string: val,
        sensor: false
      }
    }).then(function(response){
        return response.data.pessoa;
    });
  }

  $scope.passaPessoa = function(item, model, label){
    $scope.inadimplente.nome = item.id;
    $( "em[for='inadimplente_nome']" ).css("display","none");  
  }

  $scope.novoCadastro();
});

//@ sourceURL=controller.consultaRelatorioEvento.js