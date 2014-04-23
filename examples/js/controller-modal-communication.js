// controller/modal communciation
// ------------------------------

angular.module('anydialog.example.app', [
    'karolmajta.anydialog',
    'karolmajta.anydialog.adapters.bootstrap'])

    // Let's define a controller for a list of moods. It's pretty trivial...
    .controller('MoodListController', ['$scope', function ($scope) {

        // Some initial moods, we will be able to edit them
        $scope.availableMoods = [
            'Happier than unicorn',
            'Got the blues',
            'Don\'t touch me!'
        ];

        // `newMood` is used only to bind DOM input element
        $scope.newMood = null;

        // `currentMood` stores what recently was selected using the
        // modal. We set it to `null` initially because at first no
        // mood is selected.
        $scope.currentMood = null;

        // utility function to add mood to `availableMoods`
        $scope.addMood = function () {
            $scope.availableMoods.push($scope.newMood);
            $scope.newMood = null;
        };

        // utility function to remove mood from `availableMoods`
        $scope.removeMood = function (idx) {
            $scope.availableMoods.splice(idx, 1);
        };

        // This is where things get interesting. Because in the template
        // we used:
        //
        //     <modal name="moodModal"
        //            controllerd-by="MoodModalController"
        //            ... ></modal>
        //
        // Now we have `$moodModal` object available at our scope. It
        // exposes a single method: `show`. This method accepts a dictionary
        // that will be injected into newly created modal's scope. So the
        // `MoodModalController` will have `availableMoods` and `currentMood`
        // in it's scope. Please note that this is simple pass-by-reference,
        // so any changes the `MoodModalController` makes to this objects will
        // be immediately visible in this one.
        $scope.selectMood = function () {
            var modalPromise = $scope.$moodModal.show({
                availableMoods: $scope.availableMoods,
                currentMood: $scope.currentMood
            });
            // The `modalPromise` var contains what was returned by `show`.
            // `show` returns a promise. This promise result represents **dialog
            // as a visual entity**, meaning that it is resolved when the
            // dialog is shown. For most use-cases it's property `result`
            // is much more interesting.
            //
            // `result` is also a promise and it represents **the result
            // obtained by the dialog**. It will be resolved, when
            // the dialog finishes it's lifecycle and is ready to yield
            // obtained value.
            modalPromise.result.then(function (result) {
                if (result.mood) {
                  $scope.currentMood = result.mood;
                }
            });
        };

    }])

    // `MoodModalController` gets created and injected *each time* the modal
    // is shown.
    .controller('MoodModalController', ['$scope', function ($scope) {

        $scope.originalMood = $scope.currentMood;

        $scope.switchMood = function () {
            // Calling `$modal.hide` will cause the result promise inside
            // `MoodListController` to resolve with whatever was passed
            // as argument.
            $scope.$modal.hide({mood: $scope.currentMood});
        };

        $scope.close = function () {
            // Same happens here, but we hide (force resolve in
            // `MoodListController`) with original value, so close
            // is effectively a *cancel* action.
            $scope.$modal.hide({mood: $scope.originalMood});
        };

    }]);