'use strict';
angular.module('openNaaSApp')
        .controller('statisticsCtrl', function($scope, ngTableParams, $filter, localStorageService, arnService) {
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: 10, // count per page
                sorting: {
                    date: 'desc'     // initial sorting
                }
            }, {

            getData: function($defer, params) {
                var requestData = getCounter($scope.infId);
                arnService.put(requestData).then(function(response) {
                    var data = response.response.operation.interfaceList.interface.ethernet.counters;
                    console.log(data);
//                    data = '{"_dropEvents":"0","_octets":"0","_packets":"0","_broadcastPackets":"0","_multicastPackets":"0","_crcAlignErrors":"0","_undersizePackets":"0","_oversizePackets":"0","_fragments":"0","_jabbers":"0","_collisions":"0","_packets64Octets":"0","_packets65to127Octets":"0","_packets128to255Octets":"0","_packets256to511Octets":"0","_packets512to1023Octets":"0","_packets1024to1518Octets":"0","_throughput":"0"}';
                    params.total(data.length);
                $defer.resolve(data);

//                    console.log(data);
//                    var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
//                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                })
            },
            $scope: {$data: {}}
        });
                })
//    });