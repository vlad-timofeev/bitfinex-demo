export default function connect() {
  const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
  ws.onopen = (() => {
    console.log('Connected');
    const message = {
      event: 'subscribe',
      channel: 'trades',
      symbol: 'tBTCUSD',
    };
    ws.send(message);
    ws.send(JSON.stringify(message));
  });
  ws.onmessage = ((message) => {
    console.log(message);
  });
  ws.onerror = ((error) => {
    console.error(error);
  });
  ws.onclose = ((obj) => {
    console.log('Closed');
    console.log(obj);
  });
}
