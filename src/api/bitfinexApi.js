export default function connectWs(onOpen, onMessage, onClose) {
  const ws = new WebSocket('wss://api.bitfinex.com/ws/2');
  ws.onopen = onOpen;
  ws.onmessage = onMessage;
  ws.onclose = onClose;
  ws.onerror = (error => console.error(error));
  return ws;
}
