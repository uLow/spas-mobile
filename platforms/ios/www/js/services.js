angular.module('starter.services', [])

    .factory('Ambulances', function (Authentication, $http, config) {
        return {
            all: function (currentPosition) {
                return $http.post(config.backend + '/ambulances/available', {
                        login: Authentication.getCredentials().login,
                        token: Authentication.getCredentials().token,
                        latitude: currentPosition.latitude,
                        longitude: currentPosition.longitude
                    }
                );
            },
//remove: function (chat) {
//    chats.splice(chats.indexOf(chat), 1);
//},
            get: function (ambulanceId) {
                return $http.post(config.backend + '/ambulances/' + ambulanceId, {
                        login: Authentication.getCredentials().login,
                        token: Authentication.getCredentials().token
                    }
                );
            }
        };
    })
    .factory('Calls', function (Authentication, $http, config) {
        return {
            all: function () {
                return $http.post(config.backend + '/call/history', {
                        login: Authentication.getCredentials().login,
                        token: Authentication.getCredentials().token
                    }
                );
            },
            get: function (call_id) {
                return $http.post(config.backend + '/call/' + call_id, {
                        login: Authentication.getCredentials().login,
                        token: Authentication.getCredentials().token
                    }
                );
            },
            request: function (ambulance_id) {
                return $http.post(config.backend + '/call/request', {
                        login: Authentication.getCredentials().login,
                        token: Authentication.getCredentials().token,
                        ambulance_id: ambulance_id
                    }
                );
            }
        };
    })
    .factory('Authentication', function ($rootScope, $state, $http, $ionicPopup, config) {
        var isLoggedIn = false;

        // Load auth token from somewhere, like localStorage
        isLoggedIn = window.localStorage['token'] != null;

        $rootScope.$on('user.login', function (event, data) {
            window.localStorage['login'] = data.login;
            window.localStorage['token'] = data.token;
            isLoggedIn = true;
            // redir to tab.dash
            $state.go('tab.ambulances');
        });
        $rootScope.$on('user.logout', function () {
            window.localStorage['login'] = null;
            window.localStorage['token'] = null;
            isLoggedIn = false;
            // redir to login page
            $state.go('login');
        });

        return {
            hasAuthData: function () {
                var hasLogin = window.localStorage['login'] != null;
                var hasToken = window.localStorage['token'] != null;
                return hasLogin && hasToken;
            },
            isLoggedIn: function () {
                if (this.hasAuthData()) {
                    return true;
                } else {
                    $rootScope.$broadcast('user.logout');
                }
            },
            authenticate: function (data, successCallback, errorCallback) {
                return $http.post(config.backend + '/user/authenticate', {
                        login: data.login,
                        password: data.password
                    })
                    .then(function (res) {
                        if (res.data.status === 700) {
                            $rootScope.$broadcast('user.login', res.data);
                        } else {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: res.data.errors.join("<br>")
                            }).then(function (res) {
                                $rootScope.$broadcast('user.logout');
                            });
                        }
                    })
                    .catch(function (err) {
                        $rootScope.$broadcast('user.logout');
                    });
            },
            logout: function () {
                $rootScope.$broadcast('user.logout');
            },
            getCredentials: function () {
                return {
                    login: window.localStorage['login'],
                    token: window.localStorage['token']
                };
            },
            register: function (data, successCallback, errorCallback) {
                return $http.post(config.backend + '/user/register', data)
                    .then(function (res) {
                        console.log(res);
                        if (res.data.status === 710) {
                            $rootScope.$broadcast('user.login', res.data);
                        } else {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: res.data.errors.join("<br>")
                            });
                        }
                    })
                    .catch(function (err) {
                        $ionicPopup.alert({
                            title: 'Error',
                            template: res.data.errors.join("<br>")
                        });
                    });
            }
        };
    });
