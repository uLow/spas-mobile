// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'starter.providers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                cache: false,
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            // Each tab has its own nav history stack:

            .state('tab.ambulances', {
                cache: false,
                url: '/ambulances',
                views: {
                    'tab-ambulances': {
                        templateUrl: 'templates/tab-ambulances.html',
                        controller: 'AmbulancesCtrl'
                    }
                }
            })

            // Each tab has its own nav history stack:

            .state('tab.call-history', {
                cache: false,
                url: '/call-history',
                views: {
                    'tab-call-history': {
                        templateUrl: 'templates/tab-call-history.html',
                        controller: 'CallHistoryCtrl'
                    }
                }
            })
            .state('tab.call-detail', {
                cache: false,
                url: '/call-details/:callId',
                views: {
                    'tab-call-detail': {
                        templateUrl: 'templates/call-detail.html',
                        controller: 'CallDetailCtrl'
                    }
                }
            })

            .state('tab.account', {
                cache: false,
                url: '/account',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/tab-account.html',
                        controller: 'AccountCtrl'
                    }
                }
            })
            .state('tab.transactions', {
                cache: false,
                url: '/account/transactions',
                views: {
                    'tab-transactions': {
                        templateUrl: 'templates/transactions.html',
                        controller: 'TransactionsCtrl'
                    }
                }
            })

            .state('show-on-map', {
                cache: false,
                url: '/show-on-map/:ambulanceId',
                templateUrl: 'templates/show-on-map.html',
                controller: 'ShowOnMapCtrl'
            })

            .state('login', {
                cache: false,
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/login');
    });
