'use strict';

angular.module('openNaaSApp')
        .directive('grapheditor', function() {
            return {
                restrict: 'EA',
                scope: {},
                templateUrl: 'partials/d3/editor.html',
                link: function(scope, element, attrs) {
                    console.log("Editor");
                    createStencil();
                    graph = new myGraph("#graph");

                }};
        })
        .directive('graphview', function() {
            return {
                restrict: 'EA',
                scope: {},
                templateUrl: 'partials/d3/view.html',
                link: function(scope, element, attrs) {
                    console.log("View");
                    graph = new myGraph("#graph");

                    var xmlTopology = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <ns2:topology xmlns:ns2="opennaas.api"> <networkElements> <networkElement xsi:type="switch" id="openflowswitch:s1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s1.1"> <state> <congested>false</congested> </state> </port> <port id="s1.2"> <state> <congested>false</congested> </state> </port> <port id="s1.3"> <state> <congested>false</congested> </state> </port> <port id="s1.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> <networkElement xsi:type="switch" id="openflowswitch:s2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s2.1"> <state> <congested>false</congested> </state> </port> <port id="s2.2"> <state> <congested>false</congested> </state> </port> <port id="s2.3"> <state> <congested>false</congested> </state> </port> </ports> </networkElement><networkElement xsi:type="switch" id="openflowswitch:s3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <state> <congested>false</congested> </state> <ports> <port id="s3.1"> <state> <congested>false</congested> </state> </port> <port id="s3.2"> <state> <congested>false</congested> </state> </port> <port id="s3.3"> <state> <congested>false</congested> </state> </port> <port id="s3.4"> <state> <congested>false</congested> </state> </port> </ports> </networkElement> </networkElements> <links> <link> <state> <congested>false</congested> </state> <srcPort>s1.1</srcPort> <dstPort>s2.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s1.2</srcPort> <dstPort>s3.1</dstPort> </link> <link> <state> <congested>false</congested> </state> <srcPort>s2.2</srcPort> <dstPort>s3.2</dstPort> </link> </links> <networkDevicePortIdsMap> <entry> <key>s1.1</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s1.2</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s1.3</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s1.4</key> <value> <deviceId>openflowswitch:s1</deviceId> <devicePortId>4</devicePortId> </value> </entry> <entry> <key>s2.1</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s2.2</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s2.3</key> <value> <deviceId>openflowswitch:s2</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s3.1</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>1</devicePortId> </value> </entry> <entry> <key>s3.2</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>2</devicePortId> </value> </entry> <entry> <key>s3.3</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>3</devicePortId> </value> </entry> <entry> <key>s3.4</key> <value> <deviceId>openflowswitch:s3</deviceId> <devicePortId>4</devicePortId> </value> </entry> </networkDevicePortIdsMap> </ns2:topology>';
                    var json = convertXml2JSonObject(xmlTopology);
                    console.log(json);

                    var networkElements = json.topology.networkElements.networkElement;
                    var links = json.topology.links.link;
                    var nodes = [];
                    //for each network element
                    console.log(json);
                    for (var i = 0; i < networkElements.length; i++) {
                        var type = networkElements[i]["_xsi:type"];
                        var id = networkElements[i]._id.split(":")[1];
                        var ports = networkElements[i].ports.port;
//        createSwitch(id, ports);
                        var node = {};
                        node.id = id;
                        node.type = type;
                        node.ports = ports;
                        node.x = Math.floor((Math.random() * graph.getWidth()) + 1);
                        node.y = Math.floor((Math.random() * graph.getHeight()) + 1);
                        node.net_force = {};
                        node.velocity = {x: 0, y: 0};
                        nodes.push(node);
                        //{id:1, x: 10, y: 20, net_force: {}, velocity: {}
                    }
                    var edges = [];
                    var edge = {};
                    for (var i = 0; i < links.length; i++) {
                        edge = {};
                        for (var j = 0; j < nodes.length; j++) {
                            for (var t = 0; t < nodes[j].ports.length; t++) {
                                if (nodes[j].ports[t]._id === links[i].srcPort) {
                                    var srcP = j;
                                }
                                if (nodes[j].ports[t]._id === links[i].dstPort) {
                                    var dstP = j;
                                }
                            }
                        }
                        edge = {s: srcP, t: dstP};
                        edges.push(edge);
                    }

                    //create edges
                    var matrix = [];
                    for (var i = 0; i < nodes.length; i++) {
                        matrix[i] = [];
                        for (var j = 0; j < nodes.length; j++) {
                            matrix[i][j] = false;
                        }
                    }
                    for (var i = 0; i < edges.length; i++) {
                        matrix[edges[i].s][edges[i].t] = true;
                        matrix[edges[i].t][edges[i].s] = true;
                    }

                    nodes = StaticForcealgorithm(nodes, matrix);
                    for (i = 0; i < nodes.length; i++) {
                        console.log(nodes[i].x + " " + nodes[i].y);
                        if (nodes[i].x < 0) {
                            nodes[i].x = nodes[i].x + graph.getWidth() / 2;
                        }
                        if (nodes[i].y < 0) {
                            nodes[i].y = nodes[i].y + graph.getHeight() / 2;
                        }
                        if (nodes[i].x > graph.getWidth()) {
                            nodes[i].x = graph.getWidth();
                        }
                        if (nodes[i].y > graph.getHeight()) {
                            nodes[i].y = graph.getHeight();
                        }
//        createSwitch(nodes[i].id, nodes[i].ports, nodes[i].x, nodes[i].y);
                        var divPos = {x: nodes[i].x, y: nodes[i].y};
                        var data = {id: nodes[i].id, ports: nodes[i].ports};
                        createElement("ofSwitch", divPos, data);
                    }
                }};
        })
        .directive('droppable', ['$window', '$rootScope', function($window, $rootScope) {
                return {
                    // A = attribute, E = Element, C = Class and M = HTML Comment
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        element.droppable({
                            drop: function(e, ui) {
                                console.log(e);
                                console.log(angular.element(ui.draggable).parent());
                                console.log(angular.element(ui.draggable).parent().context);
                                console.log(angular.element(ui.draggable).parent().context.id);
                                var nodeType = angular.element(ui.draggable).parent().context.id;

                                var divPos = {};
                                var $div = $("#graph");
                                //    var e = window.event;
                                divPos = {//position where the element is dropped
                                    x: e.clientX,
                                    y: e.clientY
                                };
                                console.log(divPos);
                                createElement(nodeType, divPos);

                                var dragIndex = angular.element(ui.draggable).data('index'),
                                        reject = angular.element(ui.draggable).data('reject'),
                                        dragEl = angular.element(ui.draggable).parent(),
                                        dropEl = angular.element(this);
                                if (dragEl.hasClass('list1') && !dropEl.hasClass('list1') && reject !== true) {
                                    scope.list2.push(scope.list1[dragIndex]);
                                    scope.list1.splice(dragIndex, 1);
                                } else if (dragEl.hasClass('list2') && !dropEl.hasClass('list2') && reject !== true) {
                                    scope.list1.push(scope.list2[dragIndex]);
                                    scope.list2.splice(dragIndex, 1);
                                }
                                scope.$apply();
                            }
                        })
                    }
                    /*
                     var el = element[0];
                     console.log("Dropable");
                     console.log($window);
                     var w = angular.element($window);
                     console.log(w);
                     console.log(el);
                     console.log(element.position());
                     el.addEventListener(
                     'dragstart',
                     function(e) {
                     console.log(e);
                     console.log(e.target);
                     //                                console.log("ADDDDDDDDDDDDDDDDDDDD");
                     this.classList.add('over');
                     return false;
                     },
                     false
                     );
                     el.addEventListener(
                     'dragenter',
                     function(e) {
                     console.log(e.dataTransfer);
                     console.log(e.dataTransfer.srcElement);
                     console.log(e);
                     console.log(e.srcElement);
                     console.log(e.source);
                     console.log(e.target);
                     //                                console.log("ADDDDDDDDDDDDDDDDDDDD");
                     this.classList.add('over');
                     return false;
                     },
                     false
                     );
                     
                     el.addEventListener(
                     'dragleave',
                     function(e) {
                     console.log(e);
                     var id = attrs.id;
                     if (attrs.id != undefined) {
                     console.log(attrs.id);
                     console.log(angular.element(el).attr("id", id));
                     }
                     console.log(scope);
                     console.log(attrs);
                     console.log(e);
                     console.log(element);
                     console.log($rootScope.srcIdType);
                     //                                    var nodeType = ui.draggable.attr("id"); //select the id of the element
                     var divPos = {};
                     var $div = $("#graph");
                     //    var e = window.event;
                     divPos = {//position where the element is dropped
                     x: e.layerX,
                     y: e.layerY
                     };
                     //                                    createElement(nodeType, divPos);
                     this.classList.remove('over');
                     return false;
                     },
                     false
                     );
                     
                     element.draggable({
                     revert: true,
                     start: function(event, ui) {
                     console.log("AAAAAAAAAAA");
                     },
                     stop: function(event, ui) {
                     }
                     })
                     }*/
                }
            }])

        .directive('draggable', ['$window', '$rootScope', function($window, $rootScope) {
                return {
                    // A = attribute, E = Element, C = Class and M = HTML Comment
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var el = element[0];
                        console.log("Draggable");
                        console.log($window);
                        var w = angular.element($window);
                        console.log(w);
                        console.log(el);
                        console.log(element.position());
                        el.addEventListener(
                                'dragstart',
                                function(e) {
                                    console.log(e);
                                    console.log(e.target);
//                                console.log("ADDDDDDDDDDDDDDDDDDDD");
                                    this.classList.add('over');
                                    return false;
                                },
                                false
                                );
                        el.addEventListener(
                                'dragenter',
                                function(e) {
                                    console.log(e.dataTransfer);
                                    console.log(e);
                                    console.log(e.source);
                                    console.log(e.target);
//                                console.log("ADDDDDDDDDDDDDDDDDDDD");
                                    this.classList.add('over');
                                    return false;
                                },
                                false
                                );

                        el.addEventListener(
                                'dragleave',
                                function(e) {
                                    console.log(e);
                                    var id = attrs.id;
                                    if (attrs.id != undefined) {
                                        console.log(attrs.id);
                                        console.log(angular.element(el).attr("id", id));
                                    }
                                    console.log(scope);
                                    console.log(attrs);
                                    console.log(e);
                                    console.log(element);

//                                    var nodeType = ui.draggable.attr("id"); //select the id of the element
                                    var divPos = {};
                                    var $div = $("#graph");
                                    //    var e = window.event;

                                    divPos = {//position where the element is dropped
                                        x: e.layerX,
                                        y: e.layerY
                                    };

//                                    createElement(nodeType, divPos);
                                    this.classList.remove('over');
                                    return false;
                                },
                                false
                                );

                        element.draggable({
                            revert: true,
                            start: function(event, ui) {
                                console.log("AAAAAAAAAAA");
                                console.log(event);
                                console.log(ui);
                                console.log(event.target.id);
                            },
                            stop: function(event, ui) {
                            }
                        })
                    }
                };
            }]);