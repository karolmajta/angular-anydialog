angular.module('karolmajta.anydialog.adapters.notifications', [])

    .service('notificationsAdapter', ['$q', function ($q) {

        this.show = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

        this.hide = function (modalInstance, modalName, elems) {
            return $q.when(null);
        };

    }]);