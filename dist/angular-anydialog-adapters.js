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

angular.module('karolmajta.anydialog.adapters.jqueryui', [])

    .service('jqueryUiAdapter', ['$q', function ($q) {

        /*
         because jQuery moves created dialogs to to the end of body
         we must store a uid -> domElement so that we
         can then call close on proper element. We will stash the
         uid on the modal instance
         */

        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };

        /*
         thanks to:
         http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
         */

        var guid = function () {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };

        var mapping = {};

        this.show = function (modalInstance, modalName, elems) {
            var d = $q.defer();
            var uid = guid();
            mapping[uid] = elems;
            modalInstance.$uid = uid;
            elems.dialog({
                create: function (e) {
                    var dialog = $(e.target).parent();
                    dialog.find('button.ui-dialog-titlebar-close').remove();
                    d.resolve(null);
                }
            });
            return d.promise;
        };

        this.hide = function (modalInstance, modalName, elems) {
            mapping[modalInstance.$uid].dialog('destroy');
            delete mapping[modalInstance.$uid];
            return $q.when(null);
        };

    }]);
angular.module('karolmajta.anydialog.adapters.notifications', [])

    .service('notificationsAdapter', ['$q', function ($q) {

        this.show = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

        this.hide = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

    }]);