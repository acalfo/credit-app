angular.module('app.socket', [])

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

			chrome.sockets.tcp.connect(createInfo.socketId, Server.url, Server.port, function(result) {
				console.log("CONNECTED TO HOST");

				if (result === 0) {

					var requestString = "GET / HTTP/1.1\r\nHost: echo.websocket.org\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nOrigin: websocket.org\r\nSec-WebSocket-Protocol: chat, superchat\r\nSec-WebSocket-Version: 13\r\n\r\n ELLO PUPPET";
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