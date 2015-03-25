'use strict';

angular.module('openNaaSApp')
    .controller('resourceCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, RootResourceService, $interval) {
        var url = "";
    if(!$rootScope.networkId) window.location = "#!/network";
    console.log("resources");
        
        //$rootScope.$broadcast('completeTopologyData', data);
    $scope.resourceId = "";
    $scope.resources = [];
    $scope.flowList;
    $scope.flow = {};
    
    url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IResourceModelReader/resourceModel");
        MqNaaSResourceService.get(url).then(function (data) {
            $scope.resources = data.resource.resources.resource.filter(function(res){return res.type!== "link"});
        });
    $scope.update = function(){
        console.log("Selected");
        $scope.resourceId = $scope.resourceId.id;
        console.log($scope.resourceId );
        $scope.getResourceInformation();
        $interval(function(){
            $scope.getFlows();
        }, 2000);
    };
    
    
    $scope.getResourceInformation = function () {
            //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-odl-2/IRootResourceProvider/OFSwitch-3/IPortManagement/
            //IRootResourceAdministration/Network-odl-2/IRootResourceProvider/OFSwitch-3/IResourceModelReader/resourceModel
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceProvider");
            url = url + "/" + $scope.resourceId + "/IResourceModelReader/resourceModel";
            MqNaaSResourceService.get(url).then(function (data) {
                $scope.resource = data;
                console.log($scope.resource);
                console.log(data);
                $scope.resourceInfo = data.resource;
                $scope.flow.dpid = $scope.resourceInfo.externalId;
                console.log(data.resource.resources.resource);
                if (data === undefined)
                    return;
                data = checkIfIsArray(data.resource.resources.resource);
                $scope.resourcePorts = data;
                data.forEach(function (resource) {
                    // $scope.getRealPorts(resource);
                });
                
            }, function (error) {
                console.log(error);
            });
        }
    $scope.getFlows = function () {
            //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-odl-2/IFlowManagement/flows?arg0=00:00:00:00:00:00:00:02
            console.log($scope.resourceInfo);
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IFlowManagement");
            url = url + "/flows?arg0=" + $scope.resourceInfo.externalId;
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                if (data === undefined)
                    return;
                data = checkIfIsArray(data.list.flowConfig);
                $scope.flowList = data;
            }, function (error) {
                console.log(error);
            });
        }
    
}).controller('resourceMgtCtrl', function ($scope, $rootScope, MqNaaSResourceService, $routeParams, localStorageService, RootResourceService, $interval) {
        var url = "";
    if(!$rootScope.networkId) window.location = "#!/network";
    $scope.resourceId = "";
    
    url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IResourceModelReader/resourceModel");
        MqNaaSResourceService.get(url).then(function (data) {
            $scope.resources = data.resource.resources.resource;
        });
                      
        //$scope.resourceId = $routeParams.id;
        $scope.resource;
        $scope.flowList;
    $scope.flow = {};
    
        console.log($scope.resourceId);

        $scope.getResourceInformation = function () {
            //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-odl-2/IRootResourceProvider/OFSwitch-3/IPortManagement/
            //IRootResourceAdministration/Network-odl-2/IRootResourceProvider/OFSwitch-3/IResourceModelReader/resourceModel
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IRootResourceProvider");
            url = url + "/" + $scope.resourceId + "/IResourceModelReader/resourceModel";
            MqNaaSResourceService.get(url).then(function (data) {
                $scope.resource = data;
                console.log($scope.resource);
                console.log(data);
                $scope.resourceInfo = data.resource;
                $scope.flow.dpid = $scope.resourceInfo.externalId;
                console.log(data.resource.resources.resource);
                if (data === undefined)
                    return;
                data = checkIfIsArray(data.resource.resources.resource);
                $scope.resourcePorts = data;
                data.forEach(function (resource) {
                    // $scope.getRealPorts(resource);
                });
                
            }, function (error) {
                console.log(error);
            });
        }
        $scope.getResourceInformation();
        $interval(function(){
            $scope.getFlows();
        }, 2000);
    
        $scope.getFlows = function () {
            //http://localhost:9000/mqnaas/IRootResourceAdministration/Network-odl-2/IFlowManagement/flows?arg0=00:00:00:00:00:00:00:02
            console.log($scope.resourceInfo);
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IFlowManagement");
            url = url + "/flows?arg0=" + $scope.resourceInfo.externalId;
            MqNaaSResourceService.get(url).then(function (data) {
                console.log(data);
                if (data === undefined)
                    return;
                data = checkIfIsArray(data.list.flowConfig);
                $scope.flowList = data;
            }, function (error) {
                console.log(error);
            });
        }
        
        $scope.insertFlow = function(flow){
            console.log(flow);
            var xml = getOpenFlowFlow(flow.name, flow.dpid, flow.ingressPort, flow.priority, flow.etherType, flow.actions);
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IFlowManagement/addFlow");
            MqNaaSResourceService.put(url, xml).then(function (data) {
                console.log(data);
            }, function (error) {
                console.log(error);
            });
        }

        $scope.removeItem = function (flow) {
            console.log(flow);
            //mqnaas/IRootResourceAdministration/Network-odl-2/IFlowManagement/deleteFlow?arg0=00:00:00:00:00:00:00:02&arg1=test2-p2-p1
            var url = generateUrl("IRootResourceAdministration", $rootScope.networkId, "IFlowManagement");
            url = url + "/deleteFlow?arg0=" + $scope.resource.resource.externalId + "&arg1=" + flow.name;
            console.log(url);
            MqNaaSResourceService.remove(url).then(function (data) {
                console.log(data);
                
            }, function (error) {
                console.log(error);
            });
        }

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
        $scope.list();
        $scope.getLinks = function () {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRequestManagement/" + $scope.viId + "/IRequestResourceManagement/" + virtResource + "/ISliceProvider/" + slice + "/IUnitManagement/" + unitId;
            MqNaaSResourceService.get(url).then(function (response) {
                console.log(response.unit);
                $scope.links = response.unit;
            });
        };

        $scope.mappingPortsToLink = function (res1, port1, portInternalId, portEth) {
            var url = "IRootResourceAdministration/" + $rootScope.networkId + "/IRootResourceAdministration/" + res1 + "/IPortManagement/" + port1 + "/IAttributeStore/attribute/?arg0=" + portInternalId + "&arg1=" + portEth;
            MqNaaSResourceService.put(url).then(function (result) {
                $scope.resRoot = result; //empty
                $scope.mappedPort = "Mapped";
                $scope.mappedPorts.push({
                    virt: virtualPort,
                    real: realPort
                });
            });
        };
    });