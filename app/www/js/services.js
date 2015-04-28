angular.module('app.services', [])

//  CHANGE THIS TO OUR SERVER LATER
.factory('Server', function() {
  // OUR SERVER INFO
  return {
    url: 'ws://echo.websocket.org',
    port: 80
  };
})

//Socket Wrapper
.factory('Socket', function() {

});
