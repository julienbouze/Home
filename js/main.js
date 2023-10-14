var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'homeController'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'aboutController'
        })
        .when('/portfolio', {
            templateUrl: 'views/portfolio.html',
            controller: 'portfolioController'
        })
        .when('/resume', {
            templateUrl: 'views/resume.html',
            controller: 'resumeController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
app.service('DataService', function ($http) {
    var sharedData = {};

    this.loadDataFromJsonFile = function (jsonFile) {
        return $http.get(jsonFile)
            .then(function (response) {
                sharedData = response.data;
                return sharedData;
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des données : ', error);
                return null;
            });
    };
    this.getSharedData = function () {
        return sharedData;
    };
});
app.controller('navController', function ($scope, $location) {
    $scope.goToPage = function (path) {
        $location.path(path);
    };
});

app.controller('homeController', function ($scope, $location) {
});


app.controller('aboutController', function ($scope, $timeout, DataService) {
    DataService.loadDataFromJsonFile('data/skills.json')
        .then(function (data) {
            $scope.skills = data;
            $timeout(function () {
                $scope.skills.forEach(function (skill) {
                    var percentage = skill.percentage;
                    var ariaId = skill.id;

                    var progressBar = angular.element(document.querySelector('[aria-id="' + ariaId + '"]'));
                    if (progressBar.length > 0) {
                        $timeout(function () {
                            progressBar.width(percentage + '%');
                        });
                    } else {
                        console.warn('Aucun élément trouvé');
                    }
                });
            });
        })
        .catch(function (error) {
            console.error('Erreur lors du chargement des données : ', error);
        });

    DataService.loadDataFromJsonFile('data/interests.json')
        .then(function (data) {
            $scope.interests = data;
        })
        .catch(function (error) {
            console.error('Erreur lors du chargement des données : ', error);
        });
});

app.controller('portfolioController', function ($scope, DataService) {
    $scope.replaceDashes = function(input) {
        return input.replace(/-/g, ' ');
    };


    DataService.loadDataFromJsonFile('https://api.github.com/users/julienbouze/repos')
            .then(function (data) {
                $scope.projects = data;
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des données : ', error);
            });
});

app.controller('resumeController', function ($scope,DataService) {
    DataService.loadDataFromJsonFile('data/resume.json')
        .then(function (data) {
            $scope.experiences = data;
        })
        .catch(function (error) {
            console.error('Erreur lors du chargement des données : ', error);
        });
});

$(document).ready(function() {
  $(document).on('click', '.mobile-nav-toggle', function(e) {
    $('#navbar').toggleClass('navbar-mobile');
    $(this).toggleClass('bi-list bi-x');
  });
});

