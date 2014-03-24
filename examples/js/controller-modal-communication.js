angular.module('anydialog.example.app', [
    'karolmajta.anydialog',
    'karolmajta.anydialog.adapters.bootstrap'])

    .controller('MoodListController', ['$scope', function ($scope) {

        $scope.availableMoods = [
            'Happier than unicorn',
            'Got the blues',
            'Don\'t touch me!'
        ];

        $scope.newMood = null;
        $scope.currentMood = null;

        $scope.addMood = function () {
            $scope.availableMoods.push($scope.newMood);
            $scope.newMood = null;
        };

        $scope.removeMood = function (idx) {
            $scope.availableMoods.splice(idx, 1);
        };

        $scope.selectMood = function () {
          var modalPromise = $scope.$moodModal.show({
              availableMoods: $scope.availableMoods,
              currentMood: $scope.currentMood
          });
          modalPromise.result.then(function (result) {
              if (result.mood) {
                  $scope.currentMood = result.mood;
              }
          });
        };

    }])

    .controller('MoodModalController', ['$scope', function ($scope) {

        $scope.originalMood = $scope.currentMood;

        $scope.switchMood = function () {
            $scope.$modal.hide({mood: $scope.currentMood});
        };

        $scope.close = function () {
          $scope.$modal.hide({mood: $scope.originalMood});
        };

    }]);