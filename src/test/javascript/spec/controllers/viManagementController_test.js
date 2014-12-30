describe('Test Controller: listVIController', function () {
    var scope, $location, MqNaaSResourceService, x2js;
    var mockRestService = {};

    beforeEach(function () {
        module('openNaaSApp', function ($provide) {
            $provide.value('MqNaaSResourceService', mockRestService);
        });
    });

    beforeEach(module('cb.x2js'));
    beforeEach(inject(function (_x2js_) {
        x2js = _x2js_;
    }));

    beforeEach(function () {

        inject(function ($q) {
            xmlData = "<IResource><IResourceId>req-1</IResourceId><IResourceId>req-2</IResourceId></IResource>";
            mockRestService.data = x2js.xml_str2json(xmlData);
            console.log(mockRestService.data);
            var url = "test";
            mockRestService.list = function (url) {
                var defer = $q.defer();

                defer.resolve(this.data);

                return defer.promise;
            };

            mockRestService.create = function (name) {
                var defer = $q.defer();

                var id = this.data.length;

                var item = {
                    id: id,
                    name: name
                };

                this.data.push(item);
                defer.resolve(item);

                return defer.promise;
            };
        });
    });

    beforeEach(inject(function ($controller, $rootScope, _$location_, _MqNaaSResourceService_) {
        scope = $rootScope.$new();
        $location = _$location_;
        MqNaaSResourceService = _MqNaaSResourceService_;
        $controller('listVIController', {$scope: scope, $location: $location, MqNaaSResourceService: MqNaaSResourceService});
        scope.tableParams.settings().$scope = scope;
        scope.$digest();
    }));
    it('should test the VI response', function () {
//        expect(scope.data).toEqual({ IResource: { IResourceId: [ 'req-1', 'req-2' ] } });
        expect(scope.data).toEqual(['req-1', 'req-2']);
    });

});
