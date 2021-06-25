app.controller("homeController", function ($scope, LoginService) {
  $scope.user = LoginService.getCurrentUser();
  $scope.page = 1;
  // sidebar show/hide
  $scope.openNav = function () {
    document.getElementById("mySidebar").style.width = "250px";
  };
  $scope.closeNav = function () {
    document.getElementById("mySidebar").style.width = "0";
  };
});
