app.controller(
  "LoginController",
  function ($scope, $state, LoginService, $timeout, FlashService) {
    $scope.flash = FlashService.getFlash();
    $timeout(function () {
      $scope.flash = FlashService.resetFlash();
    }, 2000);

    $scope.formSubmit = function () {
      if (LoginService.login($scope.username, $scope.password)) {
        $state.transitionTo("home");
      } else {
        $scope.flash = {
          type: "error",
          message: "Invalid username/password !",
        };
        $timeout(function () {
          $scope.flash = null;
        }, 3000);
      }
    };

    $scope.typePassword = false;

    $scope.togglePassword = togglePassword;
    function togglePassword() {
      $scope.typePassword = !$scope.typePassword;
    }
  }
);
