// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
    'ionic',
    'app.controllers',
    'app.services'
  ])
  //  CHANGE THIS TO OUR SERVER LATER
  .factory('Server', function() {
    // OUR SERVER INFO
    return {
      url: 'ws://echo.websocket.org',
      port: 80
    };
  })

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }


    });
  })
  .run(function($ionicPlatform, $timeout, Server) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      /*
        RUN EVALUATION SOCKET CODE
       */

    /*
    JS Buffer conversion functions
     */
    function stringToArrayBuffer(string) {
      var buffer = new ArrayBuffer(string.length);
      var bufView = new Uint8Array(buffer);
      for (var i = 0; i < string.length; i++) {
        bufView[i] = string.charCodeAt(i);
      }
      return buffer;
    }

    function arrayBufferToString(buffer) {
      return String.fromCharCode.apply(null, new Uint8Array(buffer));
    }


    //Create and connect to socket
    chrome.sockets.tcp.create({}, function(createInfo) {
          var socketId = createInfo.socketId;
          console.log("Created TCP Connection with Host", Server.url);
          chrome.sockets.tcp.connect(createInfo.socketId, Server.url, 80, function(result) {
            console.log("CONNECTED TO HOST");
            if (result === 0) {

              var requestString = "HTTP/1.1\r\nHost: " + Server.url + "\r\n 101 Web Socket Protocol Handshake\r\n\r\n";
              var requestBuffer = stringToArrayBuffer(requestString);
              console.log("Sending HTTP GET Request over socket to ", Server.url);
              chrome.sockets.tcp.send(socketId, requestBuffer, function(writeInfo) {
                chrome.sockets.tcp.onReceive.addListener(function(info) {
                  console.log("WE HAVE RECEIVED SOCKET DATA:");
                  if (info.socketId != socketId) {
                    return;
                  }
                  var htmlString = arrayBufferToString(info.data);
                  console.log(htmlString);
                });
              });
            }
          });
      });
    });
  })

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

  //Changing imgSrcSanitizationWhiteList from current to new config
  var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
  var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0, -1) + '|chrome-extension:' + currentImgSrcSanitizationWhitelist.toString().slice(-1);

  $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);

  // Ionic uses AngularUI Router, which uses the concept of states.
  // Learn more here: https://github.com/angular-ui/ui-router.
  // Set up the various states in which the app can be.
  // Each state's controller can be found in controllers.js.
  $stateProvider


  // Set up an abstract state for the tabs directive:
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.discover', {
    url: '/discover',
    views: {
      'tab-discover': {
        templateUrl: 'templates/discover.html',
        controller: 'DiscoverCtrl'
      }
    }
  })

  .state('tab.favorites', {
    url: '/favorites',
    views: {
      'tab-favorites': {
        templateUrl: 'templates/favorites.html',
        controller: 'FavoritesCtrl'
      }
    }
  });
  // If none of the above states are matched, use this as the fallback:
  $urlRouterProvider.otherwise('/tab/discover');

});
