const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8081 });

const clients = {};

wss.on("connection", (ws) => {
  clients.client = ws;

  ws.send("Connected!");
});

function broadcast(data) {
  clients.client.send(JSON.stringify(data));
}

exports.onSettlementSubmitted = (settlement) => {
  const data = {
    type: "settlement_submitted",
    settlementId: settlement.insertedId,
    amount: settlement.amount,
  };

  broadcast(data);
};

exports.onResponseSubmitted = (response) => {
  const data = {
    type: "response_submitted",
    responseId: response.insertedId,
  };

  broadcast(data);
};

exports.wss = wss;
