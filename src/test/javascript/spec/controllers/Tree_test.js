'use strict';

describe('History controller test', function () {
  var controller, scope;
  var http;

  // load the controller's module
  beforeEach(module('openNaaSApp'));

beforeEach(inject(function($controller, $rootScope) {
     scope = $rootScope.$new();
     controller = $controller('HistoryListController', {
          $scope: scope
     });
}));


it('has correct initial values', function() {
//    var tree = localstorage;
var tree = new TreeModel(),
    root = tree.parse({name: 'Net-1', children: [{name: 'TSON-1', children:[{name: 'port-1'}]}]});
    var nodeTSON = root.first(function(node){
        return node.model.name === "TSON-1";
    });
    var node = tree.parse({name: 'port-2'});
    nodeTSON.addChild(node);
    console.log("Before");
    console.log(root);
    console.log(root.isRoot());
    console.log(root.children);
    console.log(nodeTSON);
    console.log(node);
    var portNode = root.first(function(node){
        return node.model.name === "port-2";
    });
    console.log(portNode.model);
    console.log(portNode.isRoot());
    console.log(portNode.getPath());
    var arr = portNode.getPath();
    for(var i = 0; i < arr.length; i++){
        console.log(arr[i].children);
        console.log(arr[i].model);
        console.log(arr[i].model.name);
    }
    console.log(root);
    
    node = tree.parse({name: 'port-2'});
    nodeTSON.addChild(node);
    for(var i = 0; i < nodeTSON.children.length; i++){
        console.log(nodeTSON.children[i].children);
        console.log(nodeTSON.children[i].model);
        console.log(nodeTSON.children[i].model.name);
    }
    
        expect(scope.tableParams.data.length).toBe(0);
//            expect(scope.tableParams.data.length).toEqual(1);
    });

    });
