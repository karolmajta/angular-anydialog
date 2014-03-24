angular.module('anydialog.example.app', [
    'karolmajta.anydialog',
    'karolmajta.anydialog.adapters.notifications'])

    .controller('NotificationListController', ['$scope', function ($scope) {

        var makeBlankNotification = function () {
            return {
                kind: $scope.notificationKinds[0],
                text: ''
            };
        };

        $scope.notificationKinds = [
            'good',
            'neutral',
            'bad'
        ];

        $scope.newNotification = makeBlankNotification();

        $scope.pendingNotifications = [];
        $scope.activeNotifications = [];
        $scope.counts = {
            accepted: 0,
            rejected: 0,
            sent: 0
        };

        $scope.addToPending = function () {
            $scope.pendingNotifications.push($scope.newNotification);
            $scope.newNotification = makeBlankNotification();
        };

        $scope.sendPending = function () {
            $scope.pendingNotifications.forEach(function (notif) {
                $scope.activeNotifications.unshift(notif);
                $scope.counts.sent += 1;
            });
            $scope.pendingNotifications = [];
        };

    }])

    .controller('NotificationController', ['$scope', '$timeout', function ($scope, $timeout) {

        $timeout(function () {
            $scope.$notificationModal.show({
                notification: $scope.notification
            }).result.then(function (res) {
                var foundIdx = null;
                for (var i=0; i<$scope.activeNotifications.length; i++) {
                    var n = $scope.activeNotifications[i];
                    if (n == $scope.notification) {
                        foundIdx = i;
                    }
                }
                if (foundIdx !== null) {
                    $scope.activeNotifications.splice(foundIdx, 1);
                }
                if (res === true) {
                    $scope.counts.accepted += 1;
                } else if (res === false) {
                    $scope.counts.rejected += 1;
                }
            });
        }, 0);

    }])

    .controller('NotificationModalController', ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.acceptStatus = null;

        $scope.close = function () {
            $scope.$modal.hide($scope.acceptStatus);
        };

        $scope.accept = function () {
            $scope.acceptStatus = true;
        };

        $scope.reject = function () {
            $scope.acceptStatus = false;
        };

        $timeout($scope.close, 5000);

    }]);