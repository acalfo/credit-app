angular.module('ionic.socket', [])
.service('Socket', [ 'Server',
  function( Server ) {

    this.socketId = null;

    this.create = function() {
      chrome.sockets.tcp.create({}, function(createInfo) {
        this.socketId = createInfo.socketId;
      });
    };

    this.open = function() {
      return chrome.sockets.tcp.connect(this.socketId, Server.url, Server.port);
    };

    this.send = function(buffer) {
      return chrome.sockets.tcp.send(this.socketId, buffer);
    };

    this.receive = function() {
      return chrome.sockets.tcp.onReceive.addListener();
    };

    this.close = function() {
      return chrome.sockets.tcp.close(this.socketId);
    };

  }
]);
