global.WebSocket = require("ws");
const Stomp = require("@stomp/stompjs");

if (typeof TextEncoder !== "function") {
  const TextEncodingPolyfill = require("util");
  TextEncoder = TextEncodingPolyfill.TextEncoder;
  TextDecoder = TextEncodingPolyfill.TextDecoder;
}

const messageCache = [];
let i = 0;
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
  onConnect: function(frame) {
    console.log("Client connected to", frame.headers.server);
    console.log(client.connected);

    setInterval(() => {
      if (client.connected && messageCache.length) {
        console.log(messageCache);
        console.log(i, "start dequeue date!");

        while (messageCache.length) {
          client.publish({ destination: "/queue/t1", body: String(messageCache.pop()) });
        }
      } else if (client.connected && messageCache.length === 0) {
        client.publish({ destination: "/queue/t1", body: String(i) });
      } else if (!client.connected) {
        console.log(i, "broker offline, enqueue to queue!");
        console.log(messageCache);
        messageCache.unshift(i);
      }
      i++;
    }, 4000);
  },
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

const dummyStompConfig = {
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
    if (frame.error) {
      client.reconnectDelay = 5000;
      // client.deactivate();
    }
  },
  logRawCommunication: true,
  onConnect: function(frame) {
    console.log(client.connected);
    console.log("Client connected to", frame.headers.server);
  },
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

client.activate();
