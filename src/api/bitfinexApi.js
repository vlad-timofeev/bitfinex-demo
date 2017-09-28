export default function connectWs() {
  const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
  ws.onopen = (() => {
    console.log('Connected');
    const message = {
      event: 'subscribe',
      channel: 'trades',
      symbol: 'tBTCUSD',
    };
    ws.send(JSON.stringify(message));
  });
  ws.onerror = ((error) => {
    console.error(error);
  });
  ws.onclose = ((obj) => {
    console.log('Closed');
    console.log(obj);
  });
  return ws;
}
