angular.module('karolmajta.anydialog.adapters.bootstrap', [])

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
        var jqDiv = angular.element(modalDiv).modal({
            show: true,
            keyboard: false
        });
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
