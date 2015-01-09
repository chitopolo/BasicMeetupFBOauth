// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordovaOauth', 'ionic.utils', 'ngCordova'])

.run(function($ionicPlatform) {
  //lets initiate the db
  // var db = $cordovaSQLite.openDB({name: "streetmeettest.db"});

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  openFB.init({appId: '737407316337748'});
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
   .state('app.sessions', {
     url: "/sessions",
     views: {
         'menuContent': {
             templateUrl: "templates/sessions.html",
             controller: 'SessionsCtrl'
         }
     }
   })
   .state('app.profile', {
     url: "/profile",
     views: {
         'menuContent' :{
             templateUrl: "templates/profile.html",
             controller: "ProfileCtrl"
         }
     }
   })


  .state('app.session', {
      url: "/sessions/:sessionId",
      views: {
          'menuContent': {
            templateUrl: "templates/session.html",
            controller: 'SessionCtrl'
        }
      }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/sessions');
});
