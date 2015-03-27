'use strict';

angular.module('openNaaSApp')
.controller('networkCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, RootResourceService, $modal, $interval) {
    var url = "";
    $scope.network = {};
    $scope.network.endpoint = "http://dev.ofertie.i2cat.net:8080";
    $scope.network.type = "odl";
        
    //IRootResourceProvider/?arg0=NETWORK&arg1=odl
    $scope.getNetworkList = function(){
        url = "IRootResourceProvider/?arg0=NETWORK&arg1=odl";
        MqNaaSResourceService.get(url).then(function (data) {
            //lsit of networks
            console.log(data);
            $scope.networks = data.IRootResource.IRootResourceId;
            $scope.rowCollection = $scope.networks;
        });
    }
    var promise = $interval(function(){
	$scope.getNetworkList();		
    }, 2000);

//    $scope.getNetworkList();
//    $rootScope.networkId = "Network-odl-2";
    
    $scope.selectNetwork = function(networkId){
        $rootScope.networkId = networkId;
        window.location = "#!/networkMgt";
    }
    
    $scope.createNetwork = function(network){
        console.log(network);
        var xmlNetwork = getNetwork(network.type, network.endpoint, network.user, network.password);
//        var xmlNetwork = getNetwork("odl", "http://dev.ofertie.i2cat.net:8180", "admin", "admin");
        var json = xmlNetwork;
        url = "IRootResourceAdministration";
        MqNaaSResourceService.put(url, json).then(function (data) {
            $scope.data = data;
            this.$hide();
        });
    }
    
    $scope.rowCollection = [];

    var createModal = $modal({scope: $scope, template: 'partials/network/modalCreateNetwork.html', show: false});
  // Show when some event occurs (use $promise property to ensure the template has been loaded)
  $scope.showCreateModal = function() {
    createModal.$promise.then(createModal.show);
  };

	$scope.$on("$destroy", function () {
                if (promise) {
                    $interval.cancel(promise);
                }
            });

    
}).controller('networkMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, RootResourceService) {
    var url = "";
    $scope.my_tree =  {};
    $scope.resourceTree = [];
    if(!$rootScope.networkId) {window.location = "#!/network"; return}
//    $rootScope.networkId = "Network-odl-2";
    console.log($rootScope.networkId);
    $scope.nodes = [];
    $scope.links = [];
    var data = {};
    $scope.my_tree_handler = function(branch) {
        $scope.my_tree.expand_branch(branch);
        $scope.output = "You selected: " + branch.id;
    };
    $scope.ui_handler = function (uid, type) {
            var selected;
            console.log(uid + " " + type);
            if (type === "pop") {
                $scope.tree.forEach(function (entry) {
                    console.log(entry);
                    if (entry.uid === uid) {
                        selected = entry;
                        //$scope.tree.expand_branch();//not working...
                        $scope.my_tree_handler(selected);
                    }
                });
            }
        };
    $scope.test = function(){
        console.log("TEST...........................::");
    }
    $scope.generateGraph = function(){
        console.log("generate");
        data.nodes = [];
        data.nodes.push({id:"11", name:"aa"});
        $rootScope.$broadcast('completeTopologyData', data);
    }
    $scope.createTree = function(){
        url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IResourceModelReader/resourceModel");
        MqNaaSResourceService.get(url).then(function (data) {
            //the tree
            console.log(data);
            $scope.configuredRules = data.resource.configuredRules;
            $scope.resourceTree = data.resource.resources.resource;
            console.log($scope.resourceTree);
            
            data.nodes = [];
            data.links = [];
            var links = [];
            $scope.resourceTree.forEach(function(node){
                if(node.type !== 'link' )
                    data.nodes.push({id: node.id, name: node.id});
                else
                    links.push(node.id);
            });
            //$scope.getLinks();
            data.links = $scope.links;
            
            //read list of link and ports given the resourceModel, extrac the src and dst Port
            //then, try to find in the tree the portId in order to create a topologyLink.
            links.forEach(function(linkId){
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/"+linkId+"/ILinkAdministration/srcPort";
                MqNaaSResourceService.getText(url).then(function (srcPort) {
                    var ofSwitchResources = $scope.resourceTree.filter(function(res){return res.type === "OFSwitch";});
                    var srcRes = ofSwitchResources.filter(function(res){
                        var port = res.resources.resource.filter(function(p){return p.id === srcPort});
                        if(port.length > 0) return res;
                    })[0];
                    
                    var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/"+linkId+"/ILinkAdministration/destPort";
                    MqNaaSResourceService.getText(url).then(function (dstPort) {
                        var ofSwitchResources = $scope.resourceTree.filter(function(res){return res.type === "OFSwitch";});
                        var dstRes = ofSwitchResources.filter(function(res){
                            var port = res.resources.resource.filter(function(p){return p.id === dstPort});
                            if(port.length > 0) return res;
                        })[0];
                        data.links.push({from: srcRes.id, to: dstRes.id});      
                        $rootScope.$broadcast('completeTopologyData', data);
                    });
                   
                });
            });
            
            //$rootScope.$broadcast('completeTopologyData', data);
        }, function (error) {
            console.log(error);
        });
    }
    
    $scope.createTree();
    
    $scope.drawTopology = function(){
        
    }
    
    $scope.generateTopologyData = function(){
        
    }
    
   /* $scope.getLinks = function () {
        //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-odl-2/ILinkManagement/link-1/ILinkAdministration/srcPort
        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement";
        MqNaaSResourceService.get(url).then(function (response) {
            console.log(response.IResource.IResourceId);
            var links = response.IResource.IResourceId;
            var link;
            console.log(links);
            links.forEach(function(linkId){
                link = {};
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/"+linkId+"/ILinkAdministration/srcPort";
                MqNaaSResourceService.getText(url).then(function (response) {
                    console.log(response);
                    link.srcPort = response;
                });
                url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement/"+linkId+"/ILinkAdministration/destPort";
                MqNaaSResourceService.getText(url).then(function (response) {
                    console.log(response);
                    link.dstPort = response;
                });
                $scope.links.push(link);
            });
        });
        console.log($scope.links);
    };*/
    
    //$scope.getLinks();
    
    var getMqNaaSResource = function (root, url) {
                console.log("GET MQNAAS RESOURCE. SET RESOURCES " + root);
                var url = generateUrl("IRootResourceAdministration", root, "IRootResourceProvider");
                MqNaaSResourceService.list(url).then(function (data) {
                    console.log(data);
                    if (data === undefined)
                        return;
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.networkElements = data;
                    data.forEach(function (resource) {
                       // $scope.getRealPorts(resource);
                    });

                    localStorageService.set("networkElements", data);
                    console.log("GEt and store ports");

                }, function (error) {
                    console.log(error);
                });
            };
    /*RootResourceService.list().then(function (data) {
                data = checkIfIsArray(data.IRootResource.IRootResourceId);
                $scope.listNetworks = data;
                console.log($scope.listNetworks);
                if (!$rootScope.networkId) {
                    $rootScope.networkId = data[1];
                    localStorageService.set("networkId", data[1]);
                }
                $scope.selectedNetwork = $rootScope.networkId;
                console.log("Clean localStorage networkElements due network is not created.");
                localStorageService.set("networkElements", []);
                localStorageService.set("link", []);
                console.log($rootScope.networkId);
                getMqNaaSResource($rootScope.networkId);
//                localStorageService.set("mqNaaSElements", data);
            });
*/
            $scope.setNetworkId = function (netId) {
                console.log("Select networkId to rootScope: " + netId);
                $rootScope.networkId = netId;
                localStorageService.set("networkId", netId);
                getMqNaaSResource($rootScope.networkId);
            };
    
            console.log(localStorageService.get("mqNaaSElements"));
//            console.log(JSON.parse(localStorageService.get("mqNaaSElements")));
            localStorageService.set("graphNodes", []);
            
            $scope.updateListNetworks = function(){
                console.log("Update list1");
                RootResourceService.list().then(function (data) {
                     data = checkIfIsArray(data.IRootResource.IRootResourceId);
                     console.log("UpdateList nts");
                     console.log(data);
                    $scope.listNetworks = data;
                });
            };
            
            
            $scope.list = function () {
                console.log("GET LSIT -----------------------------");
                RootResourceService.list().then(function (data) {
                    console.log(data);
                    data = checkIfIsArray(data.IRootResource.IRootResourceId);
                    $scope.listNetworks = data;
                    console.log($scope.listNetworks);
                    localStorageService.set("mqNaaSElements", data);
                });
            };

            $scope.createNetwork = function () {
                var xml = getNETWORK();
                RootResourceService.put(xml).then(function (data) {
                    $rootScope.networkId = data;
                    $scope.list();
                    $scope.updateListNetworks();
                });
            };

            $scope.createTSON = function () {
                var TSON = getResource("TSON");
                var json = TSON;
                url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceAdministration");
                MqNaaSResourceService.put(url, json).then(function (data) {
                    $scope.data = data;
                });
            };


            $scope.deleteEntry = function (resourceName) {
                console.log(resourceName);
                MqNaaSResourceService.remove(resourceName).then(function (data) {
                    console.log(data);
                    $scope.data = MqNaaSResourceService.query();
                });
            };
    
            $scope.createLink = function () {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/ILinkManagement";
                MqNaaSResourceService.put(url).then(function (data) {
                    $scope.createdLink = data;
                    $scope.createdLinkInfo = [{s: $scope.source, t: $scope.dest}];
                    localStorageService.set("link", [{s: $scope.source, t: $scope.dest}]);
                    return data;
                });
            };

            $scope.getRealPorts = function (resourceName) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement";
                MqNaaSResourceService.get(url).then(function (result) {
                    console.log(result);
                    console.log(result.IResource.IResourceId);
                    var ports = [];
                    result.IResource.IResourceId.forEach(function (entry) {
                        var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + resourceName + "/IPortManagement/" + entry + "/IAttributeStore/attribute/?arg0=portInternalId";
                        MqNaaSResourceService.getText(url).then(function (realPort) {
                            console.log("GET physical port");
                            console.log(realPort);
                            console.log(entry);
                            var p = entry+"("+realPort+")";
                            if(realPort > 99) ports.push({"_id": p});
                            console.log(ports);
                            localStorageService.set(resourceName, {name: resourceName, ports: {port: ports}});
                        });

                    });
                    
                    console.log("Set ports");
                    console.log(localStorageService.get(resourceName));
                });
            };

            

            $scope.mappingPortsToLink = function (res1, port1, portInternalId, portEth) {
                var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + res1 + "/IPortManagement/" + port1 + "/IAttributeStore/attribute/?arg0=" + portInternalId + "&arg1=" + portEth;
                MqNaaSResourceService.put(url).then(function (result) {
                    $scope.resRoot = result;//empty
                    $scope.mappedPort = "Mapped";
                    $scope.mappedPorts.push({virt: virtualPort, real: realPort});
                });
            };
    $scope.doubleClick = function(){console.log("DOUBLE clockl");};
        });
