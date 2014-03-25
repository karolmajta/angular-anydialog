angular.module('anydialog.example.app', [
    'karolmajta.anydialog',
    'karolmajta.anydialog.adapters.jqueryui'])

    .controller('DialogListController', ['$scope', function ($scope) {

        var quotes = [
            {
                quote: 'There are only two kinds of people who are ' +
                       'really fascinating: people who know absolutely ' +
                       'everything, and people who know absolutely nothing.',
                by:    'Oscar Wilde'
            },
            {
                quote: 'There\'s no present. There\'s only the immediate ' +
                       'future and the recent past. ',
                by:    'Geore Carlin'
            },
            {
                quote: 'The louder he talked of his honor, the faster we ' +
                       'counted our spoons.',
                by:    'Ralph Waldo Emerson'
            },
            {
                quote: 'I\'ve accepted that I\'m not going to die of natural ' +
                       'causes, [but] getting killed \'cuz you\'re naturally ' +
                       'a dick seems like natural causes to me.',
                by:    'Randy K. Milholland'
            }
        ];

        var randomQuote = function () {
            return quotes[Math.floor(Math.random()*quotes.length)];
        };

        $scope.first = null;
        $scope.second = null;
        $scope.third = null;

        $scope.toggleFirst = function () {
            if (!$scope.first) {
                var rq = randomQuote();
                $scope.first = $scope.$firstModal.show(rq);
                $scope.first.result.then(function () { $scope.first = null; });
            } else {
                $scope.first.then(function (m) { m.hide({}); });
            }
        };

        $scope.toggleSecond = function () {
            if (!$scope.second) {
                var rq = randomQuote();
                $scope.second = $scope.$secondModal.show(rq);
                $scope.second.result.then(function () { $scope.second = null; });
            } else {
                $scope.second.then(function (m) { m.hide({}); });
            }
        };

        $scope.toggleThird = function () {
            if (!$scope.third) {
                var rq = randomQuote();
                $scope.third = $scope.$thirdModal.show(rq);
                $scope.third.result.then(function () { $scope.third = null; });
            } else {
                $scope.third.then(function (m) {m.hide({}); });
            }
        };

    }])

    .controller('DialogController', ['$scope', function ($scope) {

        $scope.close = function () { $scope.$modal.hide({}); };

    }]);