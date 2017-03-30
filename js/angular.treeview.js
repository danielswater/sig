/*
	@license Angular Treeview version 0.1.6
	ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
	License: MIT
	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children
	<div
		data-angular-treeview="true"
		data-tree-id="tree"
		data-tree-model="roleList"
		data-node-id="roleId"
		data-node-label="roleName"
		data-node-children="children" >
	</div>
*/

(function ( angular ) {
	'use strict';

	angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
		return {
			restrict: 'A',
			link: function ( scope, element, attrs ) {
				//tree id
				var treeId = attrs.treeId;
			
				//tree model
				var treeModel = attrs.treeModel;

				//node id
				var nodeId = attrs.nodeId || 'id';

				//node permissao
				var nodePermissao = attrs.nodePermissao || 'permissao';

				//node label
				var nodeLabel = attrs.nodeLabel || 'label';

				//children
				var nodeChildren = attrs.nodeChildren || 'children';

				//tree template
				var template =
					'<ul>' +
						'<li data-ng-repeat="node in ' + treeModel + '">' +
							'<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
							'<i data-ng-hide="node.' + nodeChildren + '.length">' +
							'	<input type="checkbox" class="radiobox" ng-click="cadastrarTreeAtividade(node.id_modulo, $index)" ng-show="node.show_permissao == true" value="{{node.' + nodeId + '}}" ng-checked="node.permissao == 1">' +
							'	<span ng-show="node.show_permissao == false">&nbsp;&nbsp;</span>' +
							'</i> ' +
							'<span data-ng-class="node.selected" data-ng-click="montarAlterarAtividade(node); ' + treeId + '.selectNodeLabel(node);">{{node.' + nodeLabel + '}}</span>' +
							'<i style="float: right" data-ng-hide="node.' + nodeChildren + '.length">' +
							'	<input type="checkbox" class="radiobox" ng-disabled="node.permissao == 0" ng-click="permissaoTreeAtividade(node, $index, \'VISUALIZAR\')" ng-show="node.show_permissao == true" value="{{node.' + nodeId + '}}" ng-checked="node.visualizar == 1">' +
							'	<input type="checkbox" class="radiobox" ng-disabled="node.permissao == 0" ng-click="permissaoTreeAtividade(node, $index, \'CADASTRAR\')" ng-show="node.show_permissao == true" value="{{node.' + nodeId + '}}" ng-checked="node.cadastrar == 1">' +
							'	<input type="checkbox" class="radiobox" ng-disabled="node.permissao == 0" ng-click="permissaoTreeAtividade(node, $index, \'EXCLUIR\')" ng-show="node.show_permissao == true" value="{{node.' + nodeId + '}}" ng-checked="node.excluir == 1">' +
							'</i> ' +
							'<span data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></span>' +
						'</li>' +
					'</ul>';
					//ng-show="node.permissao == 0 && node.show_permissao == true" value="{{node.' + nodeId + '}}"
				
				//check tree id, tree model
				if( treeId && treeModel ) {

					//root node
					if( attrs.angularTreeview ) {
					
						//create tree object if not exists
						scope[treeId] = scope[treeId] || {};

						//if node head clicks,
						scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

							//Collapse or Expand
							selectedNode.collapsed = !selectedNode.collapsed;
						};

						//if node label clicks,
						scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

							//remove highlight from previous node
							if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
								scope[treeId].currentNode.selected = undefined;
							}

							//set highlight to selected node
							selectedNode.selected = 'selected';

							//set currentNode
							scope[treeId].currentNode = selectedNode;
						};
					}

					//Rendering template.
					element.html('').append( $compile( template )( scope ) );
				}
			}
		};
	}]);
})( angular );