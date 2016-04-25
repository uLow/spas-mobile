angular.module('starter.controllers', [])

    .controller('AmbulancesCtrl', function ($scope, $state, Calls, Ambulances, Authentication, $ionicPopup) {
        Authentication.isLoggedIn();

        $scope.activeAmbulance = 0;
        $scope.showCallMenu = function (id) {
            $scope.activeAmbulance = id;
        };

        $scope.isCallMenuVisible = function (id) {
            return $scope.activeAmbulance == id;
        };

        var currentPosition = {};
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPosition.latitude = position.coords.latitude;
            currentPosition.longitude = position.coords.longitude;

            Ambulances.all(currentPosition)
                .then(function (res) {
                    if (res.data.status === 0) {
                        $scope.ambulances = res.data.ambulances;
                    } else {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: res.data.errors.join("<br>")
                        });
                    }
                });
        });

        $scope.getRatingClass = function (ratio, i) {
            var isHalf = Math.round(ratio * 10) / 10 >= (i - 0.5);
            if (ratio >= i) {
                return 'ion-ios-star';
            } else if (isHalf) {
                return 'ion-ios-star-half';
            } else {
                return 'ion-ios-star-outline';
            }
        };

        $scope.getHoursToArrive = function (time) {
            return (time / 60 >= 1) ? Math.floor(time / 60) + 'h' : '';
        };
        $scope.getMinutesToArrive = function (time) {
            return Math.round(time % 60) + 'min';
        };

        $scope.test = function ($event) {
            $event.stopPropagation();
        };

        $scope.requestCall = function ($event, ambulance_id) {
            $event.stopPropagation();
            Calls.request(ambulance_id);
        };

        $scope.showOnMap = function($event){
            $state.go('show-on-map', {'ambulanceId': $scope.activeAmbulance});
        };
    })

    .controller('ShowOnMapCtrl', function ($scope, $state, Authentication, $stateParams, $ionicLoading, $compile, $cordovaGeolocation, Ambulances, imageTools, $templateCache) {
        Authentication.isLoggedIn();
        var currentPosition = {};
        var options = {timeout: 10000, enableHighAccuracy: true};

        var ambulanceId = $stateParams.ambulanceId;

        Ambulances.get(ambulanceId).then(function(res){
            if (res.data.status === 0) {
                $scope.ambulance = res.data.ambulance;
                $scope.company = res.data.company;

                $cordovaGeolocation.getCurrentPosition(options).then(function(position){
                    var latLng = new google.maps.LatLng($scope.ambulance.latitude, $scope.ambulance.longitude);
                    //var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    //Wait until the map is loaded
                    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
                        imageTools.resizeImage($scope.company.avatar_data, 48, 48, function(image){
                            var marker = new google.maps.Marker({
                                map: $scope.map,
                                icon: image,
                                position: latLng
                            });

                            var infoWindow = new google.maps.InfoWindow({
                                content: '<b class="companyName">'+$scope.company.name+'</b><br>' + $scope.ambulance.name
                            });

                            infoWindow.open($scope.map, marker);

                            //google.maps.event.addListener(marker, 'click', function () {
                            //    infoWindow.open($scope.map, marker);
                            //});
                        });
                    });
                }, function(error){
                    console.log("Could not get location");
                });
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    template: res.data.errors.join("<br>")
                });
            }
        });

        //$scope.initialize = function () {
        //    navigator.geolocation.getCurrentPosition(function (position) {
        //        currentPosition.latitude = position.coords.latitude;
        //        currentPosition.longitude = position.coords.longitude;
        //
        //        var myLatlng = new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
        //
        //        var mapOptions = {
        //            center: myLatlng,
        //            zoom: 16,
        //            mapTypeId: google.maps.MapTypeId.ROADMAP
        //        };
        //        var map = new google.maps.Map(document.getElementById("map"),
        //            mapOptions);
        //
        //        //Marker + infowindow + angularjs compiled ng-click
        //        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        //        var compiled = $compile(contentString)($scope);
        //
        //        var infowindow = new google.maps.InfoWindow({
        //            content: compiled[0]
        //        });
        //
        //        var marker = new google.maps.Marker({
        //            position: myLatlng,
        //            map: map,
        //            title: 'Uluru (Ayers Rock)'
        //        });
        //
        //        google.maps.event.addListener(marker, 'click', function () {
        //            infowindow.open(map, marker);
        //        });
        //
        //        $scope.map = map;
        //    });
        //};
        //
        //google.maps.event.addDomListener(window, 'load', $scope.initialize);
        //
        //$scope.centerOnMe = function () {
        //    if (!$scope.map) {
        //        return;
        //    }
        //
        //    $scope.loading = $ionicLoading.show({
        //        content: 'Getting current location...',
        //        showBackdrop: false
        //    });
        //
        //    navigator.geolocation.getCurrentPosition(function (pos) {
        //        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        //        $scope.loading.hide();
        //    }, function (error) {
        //        alert('Unable to get location: ' + error.message);
        //    });
        //};
        //
        //$scope.clickTest = function () {
        //    alert('Example of infowindow with ng-click')
        //};
        //
        //$scope.goBack = function(){
        //    $state.back();
        //};
    })

    .controller('CallHistoryCtrl', function ($scope, Calls, Authentication) {
        Authentication.isLoggedIn();

        Calls.all().then(function (res) {
            if (res.data.status === 0) {
                $scope.calls = res.data.calls;
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    template: res.data.errors.join("<br>")
                });
            }
        });
    })

    .controller('CallDetailCtrl', function ($scope, $stateParams, Calls, Authentication) {
        Authentication.isLoggedIn();

        Calls.get($stateParams.callId).then(function (res) {
            if (res.data.status === 0) {
                $scope.call = res.data.call;
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    template: res.data.errors.join("<br>")
                });
            }
        });
    })

    .controller('AccountCtrl', function ($scope, $state, Authentication) {
        Authentication.isLoggedIn();
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller('TransactionsCtrl', function ($scope, $state, Authentication) {
        Authentication.isLoggedIn();
        Authentication.isLoggedIn();
        $scope.chat = Calls.get($stateParams.callId);
    })

    .controller('LoginCtrl', function ($scope, Authentication, $ionicModal) {
        $scope.data = {login: '', password: ''};
        $scope.login = function (data) {
            Authentication.authenticate({
                login: data.login,
                password: data.password
            });
        };

        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.registerModal = modal;
        });
        $scope.openRegisterModal = function () {
            $scope.registerModal.show();
        };
        $scope.closeRegisterModal = function () {
            $scope.registerModal.hide();
            $scope.data = {};
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.registerModal.remove();
        });
        // Execute action on hide modal
        $scope.$on('registerModal.hidden', function () {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('registerModal.removed', function () {
            // Execute action
        });

        $scope.doRegister = function (data) {
            console.log(data);
            Authentication.register(data);
        };
    });
