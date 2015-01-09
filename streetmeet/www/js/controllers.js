angular.module('starter.controllers',  ['starter.services', 'ionic.utils', 'ngSanitize', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  $scope.fbLogin = function() {
    openFB.login(
      function(response) {
        if (response.status === 'connected') {
          console.log('Facebook login succeeded');
          $scope.closeLogin();
        } else {
          alert('Facebook login failed');
        }
      },
      {scope: 'email, publish_actions, user_events, user_about_me'});
  }
})
.controller('SessionsCtrl', function($scope, Session) {
  $scope.sessions = Session.query();
})

.controller('SessionCtrl', function($scope, $stateParams, Session) {
  $scope.session = Session.get({sessionId: $stateParams.sessionId});
  $scope.share = function(event) {
    openFB.api({
      method: 'POST',
      path: '/me/feed',
      params: {
        message: "I'll be attending: '" + $scope.session.title + "' by " +
        $scope.session.speaker
      },
      success: function () {
        alert('The session was shared on Facebook');
      },
      error: function () {
        alert('An error occurred while sharing this session on Facebook');
      }
    });
  };
})
.controller('ProfileCtrl', function($scope, $http, $cordovaOauth, $localstorage,  $sce, $cordovaGeolocation) {
    // var db = $cordovaSQLite.openDB({ name: "streetmeettest.db" });
  
  openFB.api({
    path: '/me',
    params: {fields: 'id, bio, email, verified, link, events'},
    success: function(user) {
      // var query = "INSERT INTO users (facebookuid, name, city, bio, email, verified, link) VALUES (?,?,?,?,?,?)";
      // $cordovaSQLite.execute(db, query, [user.id, user.name, user.city,  user.bio , user.email, user.verified]).then(function(res) {
      //   console.log("insertId: " + res.insertId);
      // }, function (err) {
      //   console.error('The error on sql is: ', err);
      // });
      $scope.$apply(function() {

        $scope.user = user;

      });

    },
    error: function(error) {
      alert('Facebook error: ', error);
    }
  });
  

    // for opening a background db:
    //var db = $cordovaSQLite.openDB({ name: "streetmeettest.db", bgType: 1 });

    // $scope.execute = function(user) {
     
    // };




  $scope.meetupLogin = function(){
    $cordovaOauth.meetup('3fss73ueag5e744sp45cmopag2')
    .then(function(response){
      console.log('meetup response: ', JSON.stringify(response));
      $localstorage.set('meetupToken',response.access_token)
      console.log('token: ' + $localstorage.get('meetupToken'));
      meetupGet(response.access_token);
    },function(error, response) {
     console.log("Error -> " + error);
   });
  }

  $scope.meetupReq = function(){
    var theToken = $localstorage.get('meetupToken');
    console.log('meetup req without login with token: '+ theToken);
    meetupGet(theToken);
  };

  $scope.setCurrentEvent = function(theEvent){
    $cookieStore.set('currentEvent', theEvent);
  };

  var meetupGet = function(token){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude

      token = token || '';
      console.log('meetupGet');
      var theParams ;
      if(token){
       theParams = lat+'/'+long+'/?token='+token;
     }else{
       theParams = lat+'/'+long+'/';
     }
     $http.get('http://10.6.22.238:5000/api/meetup/'+theParams)
      // $http.get('http://192.168.0.4:5000/api/meetup/'+theParams)
      .then(function(response){

        console.log('response meetup: ', JSON.stringify(response));
        $scope.meetupEvents = response.data.results;
        
        $scope.deliberatelyTrustDangerousSnippet = function() {
         return $sce.trustAsHtml($scope.meetupEvents);
       };

     })
      .catch(function(error){
        console.log('Error on meetup request: ', JSON.stringify(error));
      })
    }, function(err) {
      console.log('error: ', err);
    });

  }


    // google.maps.event.addDomListener(window, 'load', function() {
    console.log('dom listener');
    var myLatlng = new google.maps.LatLng(37.785049, -122.39981799999998);

    var mapOptions = {
       center: myLatlng,
       zoom: 16,
       mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var infocounter = 0;
    var markers = Array();
    var infoWindows = Array();
    // });
    $scope.addMarker = function(lat, long, theEvent){
      // Add a marker to the map and push to the array.
      var location = new google.maps.LatLng(lat, long);
      
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: theEvent.name,
        infoWindowIndex : infocounter 
      });
      infocounter++;
      var content = "<h3>" + theEvent.name + "<h3> <p>"+theEvent.description+"</p> <button class='button button-block button-positive'>More Info </button>";
      // console.log( 'thecontent: ', content );
      var infoWindow = new google.maps.InfoWindow({
        content : content
      });

      google.maps.event.addListener(marker, 'click', 
        function(event)
        {
          map.panTo(event.latLng);
          map.setZoom(15);
          infoWindows[this.infoWindowIndex].open(map, this);
        }
        );


      infoWindows.push(infoWindow);
      markers.push(marker);
      
      setAllMap(map);
    }
    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }

    }
    $scope.map = map;



  });


