export default function connectWs() {
  const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
  ws.onopen = (() => {
    console.log('Connected');
    const getSubscribeMessage = (channel => ({
      event: 'subscribe',
      symbol: 'tBTCUSD',
      channel,
    }));
    // ws.send(JSON.stringify(getSubscribeMessage('trades')));
    // ws.send(JSON.stringify(getSubscribeMessage('book')));
    ws.send(JSON.stringify(getSubscribeMessage('ticker')));
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
