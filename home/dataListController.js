app.controller(
  "dataListController",
  function ($scope, $filter, PagerService, randomUser) {
    randomUser.getData().then(function (response) {
      $scope.data = response.data.results;
      // assign id's
      for (let i = $scope.data.length - 1, j = 1; i >= 0; i--, j++) {
        $scope.data[i].id = j;
      }

      initController();
      function initController() {
        // initialize to page 1
        $scope.setPage(1);
      }
    });

    // for-pagination
    $scope.pager = {};
    $scope.setPage = setPage;
    $scope.pageSize = 5;

    function setPage(page, pageSize = 5) {
      // get pager object from service
      $scope.pager = PagerService.GetPager(
        $filter("filter")($scope.data, $scope.searchText).length,
        page,
        pageSize
      );

      // get current page of items for view
      $scope.employees = $filter("filter")(
        $scope.data,
        $scope.searchText
      ).slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
    }

    $scope.searchText = "";
    $scope.selectedEmployee = null;

    // goTo page 1 if searching
    $scope.$watch(
      "searchText",
      function (newValue, oldValue) {
        if (oldValue != newValue) {
          $scope.setPage(1);
        }
      },
      true
    );

    $scope.setEmployee = function (employee) {
      $scope.selectedEmployee = employee;
    };

    // get today for max attr
    $scope.today = new Date();

    // reset form when it is opened/closed
    $scope.resetForm = function () {
      var form = document.querySelector(".needs-validation");
      // reset form
      form.reset();
      // reset form-styles
      form.classList.remove("was-validated");
      // qualifications
      $scope.degrees = [{}];
      // selected employee
      $scope.selectedEmployee = null;
    };

    // calculate age
    function calcAge() {
      var Bday = +new Date($scope.dob);
      var usrAge = ~~((Date.now() - Bday) / 31557600000);
      if (usrAge == 0) usrAge = 1;
      return usrAge;
    }

    // add qualifications
    $scope.degrees = [{}];
    $scope.addRow = function () {
      // add degree
      if (
        $scope.degrees[0].education &&
        $scope.degrees[0].institute &&
        $scope.degrees[0].startDate &&
        $scope.degrees[0].endDate &&
        $scope.degrees[0].marks
      ) {
        $scope.degrees.unshift({});
      }
      // error
      else {
        document.getElementById("error").style.display = "";
        setTimeout(function () {
          document.getElementById("error").style.display = "none";
        }, 2000);
      }
    };
    $scope.delRow = function (index) {
      $scope.degrees.splice(index, 1);
    };

    // edit user
    $scope.editUser = function (user) {
      var form = document.querySelector(".needs-validation");
      // reset form-styles
      form.classList.remove("was-validated");
      // fill the form when editing
      if (user.name.fullname) {
        $scope.name = user.name.fullname;
      } else {
        $scope.name =
          user.name.title + " " + user.name.first + " " + user.name.last;
      }
      if (user.location.address) {
        $scope.address = user.location.address;
      } else {
        $scope.address =
          user.location.street.number +
          " " +
          user.location.street.name +
          ", " +
          user.location.city +
          ", " +
          user.location.country;
      }

      $scope.email = user.email;
      $scope.phone = user.phone;
      $scope.dob = new Date(user.dob.date);
      if (user.degrees) {
        $scope.degrees = user.degrees;
      } else {
        $scope.degrees = [{}];
      }
    };
    // delete user
    $scope.deleteUser = function (user) {
      $scope.data.forEach((item, index) => {
        if (item.id == user.id) {
          $scope.data.splice(index, 1);
        }
      });
      // check pages
      if (
        $scope.pager.currentPage >
        Math.ceil(
          $filter("filter")($scope.data, $scope.searchText).length /
            $scope.pageSize
        )
      ) {
        $scope.pager.currentPage--;
      }
      // reload
      setPage($scope.pager.currentPage, $scope.pageSize);
      document.querySelector(".alert-danger").style.display = "block";
      setTimeout(function () {
        document.querySelector(".alert-danger").style.display = "none";
      }, 3000);
    };

    // form-validation
    $scope.formSubmit = function () {
      let form = document.querySelector(".needs-validation");
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
      } else {
        // edit employee
        if ($scope.selectedEmployee) {
          $scope.data.forEach((item, index) => {
            if (item.id == $scope.selectedEmployee.id) {
              $scope.data[index] = {
                ...$scope.selectedEmployee,
                name: {
                  fullname: $scope.name,
                },
                email: $scope.email,
                phone: $scope.phone,
                gender: document.getElementById("userGender").value,
                location: { address: $scope.address },
                dob: { date: $scope.dob, age: calcAge() },
                id: $scope.selectedEmployee.id,
              };
              // add degree to employee
              if (
                $scope.degrees.length > 1 ||
                ($scope.degrees[0].education &&
                  $scope.degrees[0].institute &&
                  $scope.degrees[0].startDate &&
                  $scope.degrees[0].endDate &&
                  $scope.degrees[0].marks)
              ) {
                $scope.data[index].degrees = [];
                $scope.degrees.forEach((element) => {
                  $scope.data[index].degrees.unshift(element);
                });
              } else {
                $scope.data[index].degrees = null;
              }
            }
          });
        }
        // add new employee
        else {
          let temp = $scope.data[0].id + 1;
          $scope.data.unshift({
            name: {
              fullname: $scope.name,
            },
            email: $scope.email,
            phone: $scope.phone,
            gender: document.getElementById("userGender").value,
            location: { address: $scope.address },
            dob: { date: $scope.dob, age: calcAge() },
            id: temp,
          });
          // add degree to employee
          if (
            $scope.degrees.length > 1 ||
            ($scope.degrees[0].education &&
              $scope.degrees[0].institute &&
              $scope.degrees[0].startDate &&
              $scope.degrees[0].endDate &&
              $scope.degrees[0].marks)
          ) {
            $scope.data[0].degrees = [];
            $scope.degrees.forEach((element) => {
              $scope.data[0].degrees.unshift(element);
            });
          }
        }
        // close modal & Show success message
        // update message
        if ($scope.selectedEmployee) {
          document.querySelector(".alert-info").style.display = "block";
          setTimeout(function () {
            document.querySelector(".alert-info").style.display = "none";
          }, 3000);
        }
        // new user added message
        else {
          document.querySelector(".alert-primary").style.display = "block";
          setTimeout(function () {
            document.querySelector(".alert-primary").style.display = "none";
          }, 3000);
        }
        document.querySelector(".form-modal-close").click();
        // reload
        setPage($scope.pager.currentPage, $scope.pageSize);
      }
    };
  }
);

app.factory("PagerService", function PagerService() {
  // service definition
  var service = {};

  service.GetPager = GetPager;

  return service;

  // service implementation
  function GetPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 5
    pageSize = pageSize || 5;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
});
