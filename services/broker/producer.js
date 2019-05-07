global.WebSocket = require("ws");
const Stomp = require("@stomp/stompjs");
const colors = require("colors");
if (typeof TextEncoder !== "function") {
  const TextEncodingPolyfill = require("util");
  TextEncoder = TextEncodingPolyfill.TextEncoder;
  TextDecoder = TextEncodingPolyfill.TextDecoder;
}

module.exports = {
  activateClient(data, event_name, destination) {
    const messageCache = [];
    let connected = false;
    data = JSON.stringify(data);
    const stompConfig = {
      brokerURL: "ws://localhost:61614/ws",
      connectHeaders: {
        login: "username",
        passcode: "password"
      },
      debug: function(message) {
        console.log(message);
      }, // returns polling data PING PONG
      onWebSocketClose: function(message) {
        console.log("Reason: ", message.reason);
      },
      onWebSocketError: function(frame) {
        console.log("Web socket error");
      },
      logRawCommunication: true,

      onDisconnect: function() {
        console.log("Client disconnected");
      },
      onStompError: function(frame) {
        console.log(client.connected);
        console.log("Broker reported error: " + frame.headers["message"]);
        console.log("Additional details: " + frame.body);
      },
      reconnectDelay: 5000
    };
    let client = new Stomp.Client(stompConfig);

    client.onConnect = function(frame) {
      console.log("Client connected to", frame.headers.server);
      console.log(client.connected);
      if (client.connected) {
        if (messageCache.length) {
          while (messageCache.length) {
            client.publish({
              destination,
              body: messageCache.pop(),
              headers: { stage: "FEED", resourceScope: "element", event_name }
            });
          }
        } else client.publish({ destination, body: data, headers: { stage: "FEED", resourceScope: "element", event_name } });
      } else {
        messageCache.unshift(data);
        console.log(messageCache);
      }
    };

    client.activate();
  }
};
