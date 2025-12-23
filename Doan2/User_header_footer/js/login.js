const API_BASE = "https://localhost:7204/api";

const app = angular.module("loginApp", []);

app.controller("LoginController", function ($scope, $http) {
  $scope.login = {
    account: "",
    pass: "",
    role: "",
  };

  $scope.loginSubmit = function () {
    if (!$scope.login.account || !$scope.login.pass) {
      alert("Vui lòng nhập tài khoản và mật khẩu");
      return;
    }

    $http
      .post(`${API_BASE}/auth/login`, {
        account: $scope.login.account,
        pass: $scope.login.pass,
      })
      .then(function (res) {
        const data = res.data;

        // LƯU TOKEN
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", data.user);
        localStorage.setItem("userid", data.userid);

        alert("Đăng nhập thành công");

        if (data.role === "Teacher") {
          window.location.href = "../Teacher/teacher.html";
        } else {
          window.location.href = "./info.html";
        }
      })
      .catch(function (err) {
        console.error(err);
        alert("Sai tài khoản hoặc không kết nối được server");
      });
  };
});
