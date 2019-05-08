global.WebSocket = require("ws");
require("../lib/util");

const Stomp = require("@stomp/stompjs");
const stompConfig = {
  brokerURL: "ws://localhost:61614/ws",
  connectHeaders: {
    login: "username",
    passcode: "password"
  },
  debug: function(message) {
    console.log(message);
  },
  onWebSocketClose: function(message) {
    console.log("Reason: ", message.reason);
  },
  onWebSocketError: function() {
    console.log("Web socket error");
  },
  onConnect: function(frame) {
    console.log("Client connected to", frame.headers.server);

    client.subscribe(
      "/queue/t1",
      message => {
        message.ack();
      },
      { ack: "client" }
    );
  },
  onDisconnect: function() {
    console.log("Client disconnected");
  },
  onStompError: function(frame) {
    console.log("Broker reported error: " + frame.headers["message"]);
    console.log("Additional details: " + frame.body);
  },
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  logRawCommunication: true,
  heartbeatOutgoing: 4000
};

const client = new Stomp.Client(stompConfig);
console.log(client.active);
client.activate();
