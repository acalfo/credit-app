// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('app', [
  'ionic',
  'app.controllers',
  'app.services'
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
    });
  })

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

    //Changing imgSrcSanitizationWhiteList from current to new config
    //This lets us render images w/ csrf restrictions enabled during local development.
    var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
    var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0, -1) + '|chrome-extension:' + currentImgSrcSanitizationWhitelist.toString().slice(-1);

    $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);

    $stateProvider
    // Set up an abstract state for the tabs directive:
      .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html',
      controller: 'TabsCtrl'
    })

    // Each tab has its own nav history stack:
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/account.html',
          controller: 'AccountCtrl'
        }
      }
    })


    .state('tab.pay', {
      url: '/pay',
      views: {
        'tab-pay': {
          templateUrl: 'templates/pay.html',
          controller: 'PayCtrl'
        }
      }
    })

    .state('tab.receive', {
      url: '/receive',
      views: {
        'tab-receive': {
          templateUrl: 'templates/receive.html',
          controller: 'ReceiveCtrl'
        }
      }
    });
    // If none of the above states are matched, use this as the fallback:
    $urlRouterProvider.otherwise('/tab/account');

  })
  /*
    RUN EVALUATION SOCKET CODE
      Move in Service Later ~
   */

.run(function($ionicPlatform, $timeout, Server) {
  $ionicPlatform.ready(function() {
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

          //Send Something
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

        //Force Close on Timeout
        $timeout(function() {
          console.log("CLOSING SOCKET!");
          chrome.sockets.tcp.close(socketId);
        }, 1000);
      });
    });
  });
});
