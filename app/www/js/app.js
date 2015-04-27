// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'app.controllers'
])

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

      // Set the hostname; we'll need it for the HTTP request as well
      var hostname = "www.yahoo.com";

      console.log(chrome);
      // chrome.socket.create("tcp", function(createInfo) {
      //   console.log("hi!");
      // });
      chrome.sockets.tcp.create({}, function(createInfo) {
        console.log("created", createInfo);
        // 192.168.4.172
        var socketId = createInfo.socketId;
        chrome.sockets.tcp.connect(createInfo.socketId, '192.168.4.172', 80, function(result) {
          if (result === 0) {
            var requestString = "GET / HTTP/1.1\r\nHost: " + hostname + "\r\nConnection: close\r\n\r\n";
            var requestBuffer = stringToArrayBuffer(requestString);
            chrome.sockets.tcp.write(socketId, requestBuffer, function(writeInfo) {
              chrome.sockets.tcp.read(socketId, 1000, function(readInfo) {
                var htmlString = arrayBufferToString(readInfo.data);
                // do something with htmlString here
                console.log(htmlString);
              });
            });
          }
        });
        // chrome.sockets.tcp.connect(createInfo.socketId,
        //   IP, PORT, onConnectedCallback);

      });
      // chrome.socket.create("tcp", function(createInfo) {
      //   var socketId = createInfo.socketId;
      //   chrome.socket.connect(socketId, hostname, 80, function(result) {
      //     if (result === 0) {
      //       var requestString = "GET / HTTP/1.1\r\nHost: " + hostname + "\r\nConnection: close\r\n\r\n";
      //       var requestBuffer = stringToArrayBuffer(requestString);
      //       chrome.socket.write(socketId, requestBuffer, function(writeInfo) {
      //         chrome.socket.read(socketId, 1000, function(readInfo) {
      //           var htmlString = arrayBufferToString(readInfo.data);
      //           // do something with htmlString here
      //           console.log(htmlString);
      //         });
      //       });
      //     }
      //   });
      // });


    });
  })

.config(['$compileProvider',
  function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
  }
])


.config(function($stateProvider, $urlRouterProvider) {

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

})

//  CHANGE THIS TO OUR SERVER LATER
.constant('SERVER', {
  // Local server
  //url: 'http://localhost:3000'

  // Public Heroku server
  url: 'https://ionic-songhop.herokuapp.com'
});
