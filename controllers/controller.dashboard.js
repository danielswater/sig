smartSig.registerCtrl('Dashboard', function($scope, $http, $location, $filter, filterFilter, $compile, uiCalendarConfig, $timeout, Permissao, $routeParams,Mensagem) {

  /*$scope.permissoes = Permissao.validaPermissao();
  
  $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
  }, function (status) {
      console.log('status',status);
  });*/

$scope.tarefas = {};
$scope.agendas = {};
$scope.financeiros = {};
$scope.cotacoes = {};
$scope.unidades_armazenagens = {};
$scope.entidade_logada='';
$scope.associadosTipo = [];
$scope.quadras = {};
$scope.usuario = '';
$scope.gavetasVencidas = [];
$scope.gavetasVencer = [];

$scope.graficoaAluno = [];

$scope.graficoFinanceiroMesquita = [];

$scope.arrayAluno = [];

$scope.falecido = {};
$scope.recebido_pessoa = {}

$scope.show_mesquita_escola = false;
$scope.show_dashboard = false;
$scope.show_cemiterio = false;
var _ano = new Date();
$scope.anoCorrente = _ano.getFullYear();

$scope.getStatus = function(){
	$http.get('api/index.php/status/').    
	success(function(data, status, headers, config) {

		$scope.tarefas = data.status_tarefa;  	    
		$scope.agendas = data.status_tarefa.agenda;

		$scope.financeiros.avencido = data.status_tarefa.financeiro[0].vencido;
		$scope.financeiros.avencido.tipo = 'Vencidas';
		$scope.financeiros.avencido.classe = 'vencido';

		$scope.financeiros.hoje = data.status_tarefa.financeiro[1].hoje;
		$scope.financeiros.hoje.tipo = 'Vencendo hoje';
		$scope.financeiros.hoje.classe = 'hoje';        

		$scope.financeiros.vencer = data.status_tarefa.financeiro[2].vencer;
		$scope.financeiros.vencer.tipo = 'Vencendo em 3 dias';
		$scope.financeiros.vencer.classe = 'vencer';    

		$scope.cotacoes = data.status_tarefa.cotacao;

		$scope.unidades_armazenagens.avencido = data.status_tarefa.unidade_armazenagem[0].vencido;
		$scope.unidades_armazenagens.avencido.tipo = 'Vencidas';
		$scope.unidades_armazenagens.avencido.classe = 'vencido';

		$scope.unidades_armazenagens.hoje = data.status_tarefa.unidade_armazenagem[1].hoje;
		$scope.unidades_armazenagens.hoje.tipo = 'Vencendo hoje';
		$scope.unidades_armazenagens.hoje.classe = 'hoje';        

		$scope.unidades_armazenagens.vencer = data.status_tarefa.unidade_armazenagem[2].vencer;
		$scope.unidades_armazenagens.vencer.tipo = 'Vencendo em 3 dias';
		$scope.unidades_armazenagens.vencer.classe = 'vencer';    

	}).error(function(data, status, headers, config) {});
}
$scope.getStatus();

$http.get('api/index.php/usuariologado/').    
success(function(data, status, headers, config) {      
	$scope.usuario = data.user.user.idTipoEntidade;
	if($scope.usuario == 1){
		$scope.show_mesquita_escola = true;
		$scope.show_dashboard = false;
		$scope.show_cemiterio = false;
	}
	if($scope.usuario == 2){
		$scope.show_cemiterio = true;
		$scope.show_dashboard = false;
		$scope.show_mesquita_escola = false;
	}
	if($scope.usuario == 3){
		$scope.show_mesquita_escola = true;
		$scope.show_dashboard = false;
		$scope.show_cemiterio = false;
	}
	if($scope.usuario == 4){
		$scope.show_dashboard = true;
		$scope.show_mesquita_escola = false;
		$scope.show_cemiterio = false;
	}
}).error(function(data, status, headers, config) {});


$scope.passaPessoa = function(item, model, label){

    $scope.recebido_pessoa.nome = label
    if(item.id == -1){
        $scope.recebido_pessoa.nome = '';
        $scope.falecido.recebido = '';

    }else{
        $scope.falecido.recebido = item.id;
        $scope.getDados(item.id);       
    }
    $( "em[for='recebidopago']" ).css("display","none");    
}

$scope.getPessoaExists = function(val) {
    $scope.falecido.recebido = '';
    $( "em[for='recebidopago']" ).css("display","none");    

    return $http.get('api/index.php/stringfalecido?string=', {
        params: {
            string: val,
            sensor: false
        }
    }).then(function(response){
        var novaPessoa = [
        {
            id: -1,
            tipo: 'Cadastro',
            nome: 'Cadastrar novo falecido'
        }
        ];

        var pessoa = response.data.pessoa;

        if(typeof pessoa == 'undefined'){
            return novaPessoa;
        }else{
            return novaPessoa.concat(pessoa);
        }

    });
};


$scope.getDados = function(id){

    var url = '';

    if(id == undefined){
        url = 'api/index.php/consultaunidadearmazenagem/'+$scope.dash.id_quadra;
    }
    else{
        url = 'api/index.php/consultaunidadearmazenagem/0/'+id;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
        $scope.retorno = [];
        $scope.retorno = data.retorno[0];
        console.log("RETORNO", $scope.retorno);
    })
    .error(function(data, status, headers, config) {});
}

$scope.getQuadras = function(){

    $http.get('api/index.php/quadra')
    .success(function(data, status, headers, config) {
        $scope.combo_quadras = data.quadra;
    })
    .error(function(data, status, headers, config) {});
}
$scope.getQuadras();


$scope.setClass = function (status) {
	if (status == 1) {
		return 'icon-livre';  
	}
	else if(status == 2){
		return 'icon-ocupado';
	}
	else{
		return 'icon-bloqueado';
	}
	
}

$scope.editaUnidade = function(id){
	$location.path('/forms/formCadastroUA/1/'+id);
}


$scope.getGraficoAssociadosAno = function(){

    $http.get('api/index.php/dashboardgraficobarra/').    
    success(function(data, status, headers, config) {
    	$scope.associadosAno = data;
    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoAlunoTurma = function(){
	$http.get('api/index.php/turmaaluno/').    
	success(function(data, status, headers, config) {
		$scope.graficoaAluno = data.turma_aluno;
       $aluno = [];
       angular.forEach($scope.graficoaAluno, function(value, key) {
          var a = [
          value.nome,
          value.alunos.length,
          ];
          $aluno.push(a);
      });

       $scope.obj = [	
       {
          "key" : "Alunos" ,"values": $aluno
      }
      ];
  }).error(function(data, status, headers, config) {

  });


}


$scope.getGraficoFinanceiroMesquita = function(){
    $http.get('api/index.php/graficofinanceiroentidade/1').    
    success(function(data, status, headers, config) {
        $scope.graficoFinanceiroMesquita = data.entidade;
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Entrada", "values" : [';
        var stringInitSaida = ']},{"key" : "Saída", "values" : [';

        //var janeiro = $filter('currency')(data.entidade[0].setembro);
        
        initEntrada = '["Janeiro",'+data.entidade[0].janeiro+'],["Fevereiro", '+data.entidade[0].fevereiro+'], ["Março", '+data.entidade[0].marco+'], ["Abril", '+
        +data.entidade[0].abril+'], ["Maio", '+data.entidade[0].maio+'], ["Junho", '+data.entidade[0].junho+'], ["Julho", '+data.entidade[0].julho+
        '], ["Agosto", '+data.entidade[0].agosto+'], ["Setembro", '+data.entidade[0].setembro+'], ["Outubro", '+data.entidade[0].outubro+'], ["Novembro", '
        +data.entidade[0].novembro+'], ["Dezembro", '+data.entidade[0].dezembro+']';

        initSaida = '["Janeiro",'+data.entidade[1].janeiro+'],["Fevereiro", '+data.entidade[1].fevereiro+'], ["Março", '+data.entidade[1].marco+'], ["Abril", '+
        +data.entidade[1].abril+'], ["Maio", '+data.entidade[1].maio+'], ["Junho", '+data.entidade[1].junho+'], ["Julho", '+data.entidade[1].julho+
        '], ["Agosto", '+data.entidade[1].agosto+'], ["Setembro", '+data.entidade[1].setembro+'], ["Outubro", '+data.entidade[1].outubro+'], ["Novembro", '
        +data.entidade[1].novembro+'], ["Dezembro", '+data.entidade[1].dezembro+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objFinanceiro = stringInitEntrada + stringInitSaida + "]}]";
        $scope.objFinanceiro = JSON.parse(objFinanceiro);

    }).error(function(data, status, headers, config) {

    });
}



$scope.getGraficoFinanceiroCemiterio = function(){
    $http.get('api/index.php/graficofinanceiroentidade/2').    
    success(function(data, status, headers, config) {
        $scope.graficoFinanceiroMesquita = data.entidade;
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Entrada", "values" : [';
        var stringInitSaida = ']},{"key" : "Saída", "values" : [';

        initEntrada = '["Janeiro",'+data.entidade[0].janeiro+'],["Fevereiro", '+data.entidade[0].fevereiro+'], ["Março", '+data.entidade[0].marco+'], ["Abril", '+
        +data.entidade[0].abril+'], ["Maio", '+data.entidade[0].maio+'], ["Junho", '+data.entidade[0].junho+'], ["Julho", '+data.entidade[0].julho+
        '], ["Agosto", '+data.entidade[0].agosto+'], ["Setembro", '+data.entidade[0].setembro+'], ["Outubro", '+data.entidade[0].outubro+'], ["Novembro", '
        +data.entidade[0].novembro+'], ["Dezembro", '+data.entidade[0].dezembro+']';

        initSaida = '["Janeiro",'+data.entidade[1].janeiro+'],["Fevereiro", '+data.entidade[1].fevereiro+'], ["Março", '+data.entidade[1].marco+'], ["Abril", '+
        +data.entidade[1].abril+'], ["Maio", '+data.entidade[1].maio+'], ["Junho", '+data.entidade[1].junho+'], ["Julho", '+data.entidade[1].julho+
        '], ["Agosto", '+data.entidade[1].agosto+'], ["Setembro", '+data.entidade[1].setembro+'], ["Outubro", '+data.entidade[1].outubro+'], ["Novembro", '
        +data.entidade[1].novembro+'], ["Dezembro", '+data.entidade[1].dezembro+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objFinanceiro = stringInitEntrada + stringInitSaida + "]}]";
        $scope.objCemiterio = JSON.parse(objFinanceiro);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoFinanceiroEscola = function(){
    $http.get('api/index.php/graficofinanceiroentidade/3').    
    success(function(data, status, headers, config) {
        $scope.graficoFinanceiroMesquita = data.entidade;
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Entrada", "values" : [';
        var stringInitSaida = ']},{"key" : "Saída", "values" : [';

        initEntrada = '["Janeiro",'+data.entidade[0].janeiro+'],["Fevereiro", '+data.entidade[0].fevereiro+'], ["Março", '+data.entidade[0].marco+'], ["Abril", '+
        +data.entidade[0].abril+'], ["Maio", '+data.entidade[0].maio+'], ["Junho", '+data.entidade[0].junho+'], ["Julho", '+data.entidade[0].julho+
        '], ["Agosto", '+data.entidade[0].agosto+'], ["Setembro", '+data.entidade[0].setembro+'], ["Outubro", '+data.entidade[0].outubro+'], ["Novembro", '
        +data.entidade[0].novembro+'], ["Dezembro", '+data.entidade[0].dezembro+']';

        initSaida = '["Janeiro",'+data.entidade[1].janeiro+'],["Fevereiro", '+data.entidade[1].fevereiro+'], ["Março", '+data.entidade[1].marco+'], ["Abril", '+
        +data.entidade[1].abril+'], ["Maio", '+data.entidade[1].maio+'], ["Junho", '+data.entidade[1].junho+'], ["Julho", '+data.entidade[1].julho+
        '], ["Agosto", '+data.entidade[1].agosto+'], ["Setembro", '+data.entidade[1].setembro+'], ["Outubro", '+data.entidade[1].outubro+'], ["Novembro", '
        +data.entidade[1].novembro+'], ["Dezembro", '+data.entidade[1].dezembro+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objFinanceiro = stringInitEntrada + stringInitSaida + "]}]";
        $scope.objEscola = JSON.parse(objFinanceiro);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoFinanceiroCemiterio();

$scope.getGraficoJazigoCemiterio = function(){
    $http.get('api/index.php/graficojazigocemiterio/').    
    success(function(data, status, headers, config) {
        $scope.objJazigo = [{ key: "Ocupados", y: data.jazigo[0].ocupados },{ key: "Livres", y: data.jazigo[0].livres }];

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoJazigoCemiterio();

$scope.getGraficoMesquitaDoacoes = function(){
    $http.get('api/index.php/graficomesquitadoacoes/').    
    success(function(data, status, headers, config) {
        console.log("MESQUITA DOAÇÕES", data);
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Entrada", "values" : [';
        initEntrada = '["Janeiro",'+data.jazigo[0].janeiro+'],["Fevereiro", '+data.jazigo[0].fevereiro+'], ["Março", '+data.jazigo[0].marco+'], ["Abril", '+
        +data.jazigo[0].abril+'], ["Maio", '+data.jazigo[0].maio+'], ["Junho", '+data.jazigo[0].junho+'], ["Julho", '+data.jazigo[0].julho+
        '], ["Agosto", '+data.jazigo[0].agosto+'], ["Setembro", '+data.jazigo[0].setembro+'], ["Outubro", '+data.jazigo[0].outubro+'], ["Novembro", '
        +data.jazigo[0].novembro+'], ["Dezembro", '+data.jazigo[0].dezembro+']';

        stringInitEntrada += initEntrada;


        var objMesquitaDoacoes = stringInitEntrada + "]}]";
        $scope.objMesquitaDoacoes = JSON.parse(objMesquitaDoacoes);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoMesquitaDoacoes();

$scope.getGraficoAlunoMensalistaBolsista = function(){
    $http.get('api/index.php/graficoalunosmensalistasbolsistas/').    
    success(function(data, status, headers, config) {
        $scope.objAluno = [{ key: "Mensalistas", y: data.alunos[0].mensalista },{ key: "Bolsistas", y: data.alunos[0].bolsista }];

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoAlunoMensalistaBolsista();

$scope.getGraficoPagantesInadimplentesMesquita = function(){
    $http.get('api/index.php/graficopagantesinadimplentes/1').    
    success(function(data, status, headers, config) {
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Pagantes", "values" : [';
        var stringInitSaida = ']},{"key" : "Inadimplentes", "values" : [';

        initEntrada = '["Janeiro",'+data.pessoas[0].janeiro_p+'],["Fevereiro", '+data.pessoas[0].fevereiro_p+'], ["Março", '+data.pessoas[0].marco_p+'], ["Abril", '+
        +data.pessoas[0].abril_p+'], ["Maio", '+data.pessoas[0].maio_p+'], ["Junho", '+data.pessoas[0].junho_p+'], ["Julho", '+data.pessoas[0].julho_p+
        '], ["Agosto", '+data.pessoas[0].agosto_p+'], ["Setembro", '+data.pessoas[0].setembro_p+'], ["Outubro", '+data.pessoas[0].outubro_p+'], ["Novembro", '
        +data.pessoas[0].novembro_p+'], ["Dezembro", '+data.pessoas[0].dezembro_p+']';

        initSaida = '["Janeiro",'+data.pessoas[0].janeiro_i+'],["Fevereiro", '+data.pessoas[0].fevereiro_i+'], ["Março", '+data.pessoas[0].marco_i+'], ["Abril", '+
        +data.pessoas[0].abril_i+'], ["Maio", '+data.pessoas[0].maio_i+'], ["Junho", '+data.pessoas[0].junho_i+'], ["Julho", '+data.pessoas[0].julho_i+
        '], ["Agosto", '+data.pessoas[0].agosto_i+'], ["Setembro", '+data.pessoas[0].setembro_i+'], ["Outubro", '+data.pessoas[0].outubro_i+'], ["Novembro", '
        +data.pessoas[0].novembro_i+'], ["Dezembro", '+data.pessoas[0].dezembro_i+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objPIMesquita = stringInitEntrada + stringInitSaida + "]}]";

        $scope.objPIMesquita = JSON.parse(objPIMesquita);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoPagantesInadimplentesMesquita();

$scope.getGraficoPagantesInadimplentesCemiterio = function(){
    $http.get('api/index.php/graficopagantesinadimplentes/2').    
    success(function(data, status, headers, config) {
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Pagantes", "values" : [';
        var stringInitSaida = ']},{"key" : "Inadimplentes", "values" : [';

        initEntrada = '["Janeiro",'+data.pessoas[0].janeiro_p+'],["Fevereiro", '+data.pessoas[0].fevereiro_p+'], ["Março", '+data.pessoas[0].marco_p+'], ["Abril", '+
        +data.pessoas[0].abril_p+'], ["Maio", '+data.pessoas[0].maio_p+'], ["Junho", '+data.pessoas[0].junho_p+'], ["Julho", '+data.pessoas[0].julho_p+
        '], ["Agosto", '+data.pessoas[0].agosto_p+'], ["Setembro", '+data.pessoas[0].setembro_p+'], ["Outubro", '+data.pessoas[0].outubro_p+'], ["Novembro", '
        +data.pessoas[0].novembro_p+'], ["Dezembro", '+data.pessoas[0].dezembro_p+']';

        initSaida = '["Janeiro",'+data.pessoas[0].janeiro_i+'],["Fevereiro", '+data.pessoas[0].fevereiro_i+'], ["Março", '+data.pessoas[0].marco_i+'], ["Abril", '+
        +data.pessoas[0].abril_i+'], ["Maio", '+data.pessoas[0].maio_i+'], ["Junho", '+data.pessoas[0].junho_i+'], ["Julho", '+data.pessoas[0].julho_i+
        '], ["Agosto", '+data.pessoas[0].agosto_i+'], ["Setembro", '+data.pessoas[0].setembro_i+'], ["Outubro", '+data.pessoas[0].outubro_i+'], ["Novembro", '
        +data.pessoas[0].novembro_i+'], ["Dezembro", '+data.pessoas[0].dezembro_i+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objPICemiterio = stringInitEntrada + stringInitSaida + "]}]";

        $scope.objPICemiterio = JSON.parse(objPICemiterio);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoPagantesInadimplentesCemiterio();

$scope.getGraficoPagantesInadimplentesEscola = function(){
    $http.get('api/index.php/graficopagantesinadimplentes/3').    
    success(function(data, status, headers, config) {
        var initEntrada = '';
        var initSaida = '';
        var stringInitEntrada = '[{"key" : "Pagantes", "values" : [';
        var stringInitSaida = ']},{"key" : "Inadimplentes", "values" : [';

        initEntrada = '["Janeiro",'+data.pessoas[0].janeiro_p+'],["Fevereiro", '+data.pessoas[0].fevereiro_p+'], ["Março", '+data.pessoas[0].marco_p+'], ["Abril", '+
        +data.pessoas[0].abril_p+'], ["Maio", '+data.pessoas[0].maio_p+'], ["Junho", '+data.pessoas[0].junho_p+'], ["Julho", '+data.pessoas[0].julho_p+
        '], ["Agosto", '+data.pessoas[0].agosto_p+'], ["Setembro", '+data.pessoas[0].setembro_p+'], ["Outubro", '+data.pessoas[0].outubro_p+'], ["Novembro", '
        +data.pessoas[0].novembro_p+'], ["Dezembro", '+data.pessoas[0].dezembro_p+']';

        initSaida = '["Janeiro",'+data.pessoas[0].janeiro_i+'],["Fevereiro", '+data.pessoas[0].fevereiro_i+'], ["Março", '+data.pessoas[0].marco_i+'], ["Abril", '+
        +data.pessoas[0].abril_i+'], ["Maio", '+data.pessoas[0].maio_i+'], ["Junho", '+data.pessoas[0].junho_i+'], ["Julho", '+data.pessoas[0].julho_i+
        '], ["Agosto", '+data.pessoas[0].agosto_i+'], ["Setembro", '+data.pessoas[0].setembro_i+'], ["Outubro", '+data.pessoas[0].outubro_i+'], ["Novembro", '
        +data.pessoas[0].novembro_i+'], ["Dezembro", '+data.pessoas[0].dezembro_i+']';

        stringInitEntrada += initEntrada;
        stringInitSaida += initSaida;

        var objPIEscola = stringInitEntrada + stringInitSaida + "]}]";

        $scope.objPIEscola = JSON.parse(objPIEscola);

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoPagantesInadimplentesEscola();

$scope.getAvisoVencimentoGaveta = function(){

    $http.get('api/index.php/avisovencimentogaveta/').    
    success(function(data, status, headers, config) {        
        $scope.gavetasVencidas = data[0].vencidos;
        $scope.gavetasVencer = data[0].vencer;

    }).error(function(data, status, headers, config) {

    });
}

$scope.getGraficoAlunoTurma();

$scope.getGraficoFinanceiroMesquita();

$scope.getAvisoVencimentoGaveta();

$scope.getPizza = function(){

	$http.get('api/index.php/dashboardgraficopizza/').    
	success(function(data, status, headers, config) {

		$scope.entidade_logada = data['entidade_logada'];


		if(data['entidade_logada']==1 || data['entidade_logada']==4){

			$scope.pessoas = [ {"key":"Associados"         ,"x":data['pizza'][0].ass,"y":data['pizza'][0].perc_ass},
			{"key":"Donat\u00e1rios"    ,"x":data['pizza'][0].don,"y":data['pizza'][0].perc_don},
			{"key":"Entidades"          ,"x":data['pizza'][0].ent,"y":data['pizza'][0].perc_ent},
			{"key":"Funcion\u00e1rios"  ,"x":data['pizza'][0].fnc,"y":data['pizza'][0].perc_fnc},
			{"key":"Fornecedor"         ,"x":data['pizza'][0].fnd,"y":data['pizza'][0].perc_fnd},
			{"key":"N\u00e3o associados","x":data['pizza'][0].nas,"y":data['pizza'][0].perc_nas}];

			$scope.getGraficoAssociadosAno();
		}else{

			$scope.pessoas = data['pizza'];
		}
	}).
	error(function(data, status, headers, config) {});
}


$scope.getPizza();


$scope.openTooltip = function(model){
	console.log('openTooltip', model);
}

$scope.closeTooltip = function(){
	console.log('closeTooltip');
}

$scope.visualizarRegistro = function(url){
	$location.path(url);
}

$scope.xAxisTickFormatFunction = function(){
	return function(d){
		return d3.format(',f')(new Number(d));
	}
}

$scope.tooltipUsuarios = function(){
	return function (key, y, e, graph) {
		var pessoas = "";
		var content = '<h3 style="background-color: ';
		content += e.color + '">';
		content += key + '</h3><p>' +  y + '</p>';
		content += '<p>' +  graph.value + '</p>';
		return content;
	}
}
/*
  $scope.associadosTipo = [ {"key":"Associados","y":"10"},
                            {"key":"Donat\u00e1rios","y":"10"},
                            {"key":"Entidades","y":"10"},
                            {"key":"Funcion\u00e1rios","y":"10"},
                            {"key":"Fornecedor","y":"10"},
                            {"key":"N\u00e3o associados","y":"10"}];
                            */


                            $scope.xFunction = function(){
                            	return function(d) {
                            		return d.key;
                            	};
                            }
                            $scope.yFunction = function(){
                            	return function(d) {
                            		return d.y;
                            	};
                            }
                            $scope.toolTipContentFunction = function(){
                            	return function(key, y, x, e, graph) {      
                            		return  '<div style="margin:10px;">' + 
                            		'<h2>' + 
                            		key + 
                            		'</h2>' +
                            		'<div style="text-align: center;">' +
                            		y + '% <br />' +
                            		x.point.x +
                            		'</div>' +
                            		'</div>'
                            	}
                            }

                            $scope.$on('elementClick.directive', function(angularEvent, event){



                            	switch(parseInt($scope.entidade_logada))
                            	{
        case 1: //Mesquita

        switch(event.index)
        {
        	case 0:
        	location.href = './dashboard.html#/consulta/consultaAssociado';
        	break;
        	case 1:
        	location.href = './dashboard.html#/consulta/consultaDonatario';
        	break;
        	case 2:
        	location.href = './dashboard.html#/consulta/consultaEntidades';
        	break;
        	case 3:
        	location.href = './dashboard.html#/consulta/consultaFuncionario';
        	break;
        	case 4:
        	location.href = './dashboard.html#/consulta/consultaFornecedor';
        	break;
        	case 5:
        	location.href = './dashboard.html#/consulta/consultaNaoAssociado';
        	break;
        }
        break;
        case 2: //Cemitério
        break;
        case 3: //Escola
        switch(event.index)
        {
                    case 0: //Aluno
                    location.href = './dashboard.html#/escolaconsulta/consultaAluno';
                    break;
                    case 1: //Professor
                    location.href = './dashboard.html#/escolaconsulta/consultaFuncionarioEscola';
                    break;
                }
                break;
            }
        });

$scope.tabs = [
{"active":true,  "id_tipo_lancamento": 1, "nome":'Mesquita',        "classe":'btnmd-success',   "texto":'Adicionar novo recebimento',       "indice":1},
{"active":false, "id_tipo_lancamento": 2, "nome":'Escola',      "classe":'btnmd-danger',    "texto":'Adicionar nova despesa fixa',      "indice":2},
{"active":false, "id_tipo_lancamento": 3, "nome":'Cemitério',  "classe":'btnmd-danger',    "texto":'Adicionar nova despesa variável',  "indice":3}
];

$scope.changeTab = function(index) {
    $scope.tabssel = $scope.tabs[index];
};

$scope.tabssel = $scope.tabs[0];

});
//@ sourceURL=controller.dashboard.js