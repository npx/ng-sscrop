var app = angular.module('app', ['ng-sscrop']);

app.controller('cropper', function ($scope) {
  $scope.settings = {
    width: 1000,
    height: 700
  };

  $scope.zdisabled = true;
  $scope.enableZoom = function() {
    $scope.$apply(function(){
      $scope.zdisabled = false;
    });
  };

  $scope.result = { };

  $scope.image = new Image();
  $scope.fileChanged = function(x) {
    $scope.image.src = URL.createObjectURL(x.srcElement.files[0]);
  };

});

app.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
});
