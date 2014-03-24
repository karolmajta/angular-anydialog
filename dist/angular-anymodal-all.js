angular.module('karolmajta.anymodal', [])

    .directive('modal', [
        '$exceptionHandler',
        '$controller',
        '$q',
        '$templateCache',
        '$parse',
        '$http',
        '$compile',
        '$injector',
        function ($exceptionHandler,
                  $controller,
                  $q,
                  $templateCache,
                  $parse,
                  $http,
                  $compile,
                  $injector) {

            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {

                    if(!attrs.name) {
                        $exceptionHandler(
                            'modal could not be bound.',
                            '`name` attribute was not set, or set to falsy value.' +
                            '`name` attribute is required to bind model to controller scope'
                        );
                        return; // do nothing
                    }
                    if(!attrs.adapter) {
                        $exceptionHandler(
                            'modal could not be bound.',
                            '`adapter` attribute was not set, or set to falsy value.' +
                            '`adapter` attribute is required to inject proper UI adapter.'
                        );
                        return;
                    }
                    if(!attrs.adapter) {
                        $exceptionHandler(
                            'modal could not be bound.',
                            '`templateUrl` was not set'
                        );
                        return;
                    }

                    var name = attrs.name;
                    var adapter = $injector.get(attrs.adapter);
                    var isInDom = false;
                    var rootContext = scope;
                    var controlledBy = attrs.controlledBy ? attrs.controlledBy : null;
                    var templateUrlFactory = $parse(attrs.templateUrl);

                    var Modal = function (pristineScope, initial) {
                        var alreadyHidden = false;
                        var templateUrl = templateUrlFactory(rootContext);
                        var self = this;
                        var scope = pristineScope;
                        if (!initial) { initial = {}; }
                        for (var key in initial) {
                            if (initial.hasOwnProperty(key)) {
                                scope[key] = initial[key];
                            }
                        }

                        if(controlledBy) {
                            $controller(controlledBy, {$scope: scope});
                        }

                        var deferredTemplate = $q.defer();
                        if ($templateCache.get(templateUrl) !== undefined) {
                            deferredTemplate.resolve($templateCache.get(templateUrl));
                        } else {
                            $http.get(templateUrl).then(function (result) {
                                var templateText = result.data;
                                $templateCache.put(templateUrl, templateText);
                                deferredTemplate.resolve(templateText);
                            }, function (reason) {
                                deferredTemplate.resolve('');
                            });
                        }

                        var deferredCompiledNode = $q.defer();
                        deferredTemplate.promise.then(function (templateText) {
                            var linkFunction = $compile(templateText);
                            var linkedNode = linkFunction(pristineScope);
                            deferredCompiledNode.resolve(linkedNode);
                        });

                        var deferredModal = $q.defer();
                        deferredCompiledNode.promise.then(function (domNode) {
                            element.empty();
                            element.append(domNode);
                            adapter.show(self, name, domNode).finally(function () {
                                deferredModal.resolve(self);
                            });
                            isInDom = true;
                        });

                        var deferredModalResult = $q.defer();
                        this.hide = function(returnValue) {
                            var d = $q.defer();
                            if (!alreadyHidden) {
                                alreadyHidden = true;
                                adapter.hide(self, name, $(element).children()).then(
                                    function (result) { deferredModalResult.resolve(returnValue); d.resolve(result); },
                                    function (reason) { deferredModalResult.resolve(returnValue); d.reject(reason); }
                                ).finally(function () {
                                        scope.$destroy();
                                        element.empty();
                                        isInDom = false;
                                    });
                            }
                            return d.promise;
                        };

                        deferredModal.promise.result = deferredModalResult.promise;
                        return deferredModal.promise;
                    };

                    var show = function(initial) {
                        if (isInDom) {
                            $exceptionHandler('Modal `' + name + '` already shown', 'Please call #hide first');
                            return $q.when(null);
                        }
                        var pristineScope = scope.$new(true);
                        var modal = new Modal(pristineScope, initial);
                        modal.then(function (resolvedModal) {
                            pristineScope.$modal = resolvedModal;
                        });
                        return modal;
                    };
                    rootContext['$' + name] = {
                        show: show
                    };
                }
            };

        }]);
angular.module('karolmajta.anymodal.adapters.bootstrap', [])

  .service('bootstrapAdapter', ['$q', function ($q) {

      this.show = function (modalInstance, modalName, elems) {
        var modalDiv = [];
        for(var i=0; i<elems.length; i++) {
            var elem = elems[i];
            var classesString = angular.element(elem).attr('class');
            classesString = classesString ? classesString : '';
            var classes = classesString.split(' ');
            if (classes.indexOf('modal') > -1) {
                modalDiv.push(elem);
            }
        }
        var jqDiv = angular.element(modalDiv).modal('show');
        jqDiv.unbind('click');
        var d = $q.defer();
        jqDiv.on('shown.bs.modal', function (e) {
            d.resolve(null);
        });
        return d.promise;
      };

      this.hide = function (modalInstance, modalName, elems) {
        var deferredClose = $q.defer();
        elems.on('hidden.bs.modal', function () {
          angular.element('body').removeClass('modal-open');
          angular.element('.modal-backdrop').remove();
          deferredClose.resolve(null);
        });
        elems.modal('hide');
        return deferredClose.promise;
      };

  }]);
angular.module('karolmajta.anymodal.adapters.notifications', [])

    .service('notificationsAdapter', ['$q', function ($q) {

        this.show = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

        this.hide = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

    }]);