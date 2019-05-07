const stompit = require("stompit");
const { ConnectFailover } = stompit;

const reconnectOptions = {
  maxReconnects: 50,
  randomize: false
};

const server1 = {
  host: "localhost",
  port: 61613,
  connectHeaders: {
    host: "/",
    login: "username",
    passcode: "password",
    "heart-beat": "5000,5000"
  }
};

const sendParams = {
  destination: "/topic/T1",
  persistent: "true"
};
let count = 0;
const delayMs = 1000;

const connManager = new ConnectFailover([server1], reconnectOptions);

connManager.on("error", function(error) {
  const connectArgs = error.connectArgs;
  const address = connectArgs.host + ":" + connectArgs.port;
  console.error("Could not connect to " + address + " : " + error.message);
  return;
});
connManager.on("connecting", function(connector) {
  const address = connector.serverProperties.remoteAddress.transportPath;
  console.log("Connecting to " + address);
});

connManager.connect(function(error, client, reconnect) {
  if (error) {
    console.log("terminal error, given up reconnecting: " + error);
    return;
  }
  sendMsg(50, error);

  function sendMsg(totalMsgs) {
    setTimeout(() => {
      console.log("sending message " + count);
      client.send(sendParams).end("Received: " + count);
      if (count++ < totalMsgs) {
        sendMsg(totalMsgs);
      } else {
        client.send(sendParams).end("DISCONNECT");
        client.disconnect();
        console.log("Done.");
      }
    }, delayMs);
  }

  client.on("error", function(error) {
    // destroy the current client
    client.destroy(error);
    // calling reconnect is optional and you may not want to reconnect else the
    // same error will be repeated.
    reconnect();
  });
});
