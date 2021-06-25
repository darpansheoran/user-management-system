app.controller("chartsController", function ($scope, randomUser) {
  // Initialize chart
  var chartData = [
    { label: "Males", value: 50 },
    { label: "Females", value: 50 },
  ];
  var dataSource = {
    chart: {
      caption: "Comparison of number of males and females",
      subCaption: "Data contains 100 results",
      xAxisName: "Gender",
      yAxisName: "Number",
      numberSuffix: "",
      theme: "fusion",
    },
    data: chartData,
  };
  $scope.myDataSource = dataSource;

  // update chart with data from api
  randomUser.getData().then(function (response) {
    var ageGroup1 = 0;
    var ageGroup2 = 0;
    var ageGroup3 = 0;
    var ageGroup4 = 0;
    var ageGroup5 = 0;
    var ageGroup6 = 0;

    for (i = 0; i < response.data.results.length; i++) {
      if (response.data.results[i].dob.age <= 20) {
        ageGroup1++;
      } else if (
        response.data.results[i].dob.age > 20 &&
        response.data.results[i].dob.age <= 30
      ) {
        ageGroup2++;
      } else if (
        response.data.results[i].dob.age > 30 &&
        response.data.results[i].dob.age <= 40
      ) {
        ageGroup3++;
      } else if (
        response.data.results[i].dob.age > 40 &&
        response.data.results[i].dob.age <= 50
      ) {
        ageGroup4++;
      } else if (
        response.data.results[i].dob.age > 50 &&
        response.data.results[i].dob.age <= 60
      ) {
        ageGroup5++;
      } else {
        ageGroup6++;
      }
    }

    chartData = [
      { label: "<20", value: ageGroup1 },
      { label: "21-30", value: ageGroup2 },
      { label: "31-40", value: ageGroup3 },
      { label: "40-50", value: ageGroup4 },
      { label: "50-60", value: ageGroup5 },
      { label: ">60+", value: ageGroup6 },
    ];

    dataSource = {
      chart: {
        caption: "Users based on their age",
        subCaption: "Data from 100 results",
        xAxisName: "Age group",
        yAxisName: "Number",
        numberSuffix: "",
        theme: "fusion",
      },
      data: chartData,
    };
    $scope.myDataSource = dataSource;
  });
});
