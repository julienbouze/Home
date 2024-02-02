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
    $scope.nb_projects = 0;
    $scope.max_projects = 18;
    $scope.current_page = 1;

    $scope.loadData = function () {
        DataService.loadDataFromJsonFile('https://api.github.com/users/julienbouze')
            .then(function (data) {
                $scope.nb_projects = data.public_repos - 1;
                $scope.nb_pages = Math.ceil($scope.nb_projects / $scope.max_projects);
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des données : ', error);
            });

        DataService.loadDataFromJsonFile('https://api.github.com/users/julienbouze/repos?per_page=' + $scope.max_projects + '&page=' + $scope.current_page)
            .then(function (data) {
                $scope.projects = data;
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des données : ', error);
            });
    };
    $scope.getRepoDetails = function (project) {
        DataService.loadDataFromJsonFile(project.url)
            .then(function (data) {
                $scope.selectedProject = data;
                DataService.loadDataFromJsonFile(project.languages_url)
                    .then(function (data2) {
                        $scope.languages = Object.keys(data2);
                    })
                    .catch(function (error) {
                        console.error('Erreur lors du chargement des langages du repository : ', error);
                    });
            })
            .catch(function (error) {
                console.error('Erreur lors du chargement des détails du repository : ', error);
            });
    };
    $scope.resetRepoDetails = function () {
        $scope.selectedProject = null;
        $scope.languages = null;
    };


    $scope.loadData();
    $scope.replaceDashes = function (input) {
        if (input) {
            return input.replace(/-/g, ' ');
        } else {
            return '';
        }
    };

    $scope.convertDate = function (dateGitHub) {
        const date = new Date(dateGitHub);
        date.setMinutes(date.getMinutes() + 60);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedDate = `${formattedDay}/${formattedMonth}/${year} à ${formattedHours}:${formattedMinutes}`;
        return formattedDate;
    };


    $scope.getPagesArray = function () {
        if ($scope.nb_pages > 0) {
            return new Array($scope.nb_pages).fill(0).map((_, index) => index + 1);
        } else {
            return [];
        }
    };

    $scope.goToPageNumber = function (pageNumber) {
        $scope.current_page = pageNumber;
        $scope.loadData();
    };
});


app.controller('resumeController', function ($scope, DataService) {
    DataService.loadDataFromJsonFile('data/resume.json')
        .then(function (data) {
            $scope.experiences = data;
        })
        .catch(function (error) {
            console.error('Erreur lors du chargement des données : ', error);
        });
});


$(document).ready(function () {
    $(document).on('click', '.mobile-nav-toggle', function (e) {
        $('#navbar').toggleClass('navbar-mobile');
        $(this).toggleClass('bi-list bi-x');
    });
});


