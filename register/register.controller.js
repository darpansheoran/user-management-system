app.controller(
  "RegisterController",
  function ($scope, $state, $timeout, LoginService, FlashService) {
    $scope.formSubmit = function () {
      if (!LoginService.checkUsername($scope.userName)) {
        $scope.flash = {
          type: "error",
          message: `Username '${$scope.userName}' is taken.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else if ($scope.password != $scope.confirmPassword) {
        $scope.flash = {
          type: "error",
          message: `Passwords don't match.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else if (!new RegExp("^(?=.*[a-z])").test($scope.password)) {
        $scope.flash = {
          type: "error",
          message: `Password must contain a lowercase letter.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else if (!new RegExp("^(?=.*[A-Z])").test($scope.password)) {
        $scope.flash = {
          type: "error",
          message: `Password must contain an uppercase letter.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else if (!new RegExp("^(?=.*[0-9])").test($scope.password)) {
        $scope.flash = {
          type: "error",
          message: `Password must contain a number.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else if ($scope.password.length < 8) {
        $scope.flash = {
          type: "error",
          message: `Password too short.`,
        };
        $timeout(function () {
          $scope.flash = null;
        }, 2000);
      } else {
        LoginService.addUser({
          username: $scope.userName,
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          password: $scope.password,
        });
        FlashService.setSuccessMessage("Registration successful.");
        $state.transitionTo("login");
      }
    };

    $scope.typePassword = false;

    $scope.togglePassword = togglePassword;
    function togglePassword() {
      $scope.typePassword = !$scope.typePassword;
    }

    // for confirm input
    $scope.typePassword2 = false;

    $scope.togglePassword2 = togglePassword2;
    function togglePassword2() {
      $scope.typePassword2 = !$scope.typePassword2;
    }
    var passwdTooltip = document.querySelector(".fa-info-circle");
    var tooltip = new bootstrap.Tooltip(passwdTooltip);
  }
);
