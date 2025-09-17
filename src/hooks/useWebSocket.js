// src/hooks/useWebSocket.js
import { useEffect, useState } from 'react';

export default function useWebSocket(token) {
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket('ws://localhost:5000');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connecté');
      ws.send(JSON.stringify({ type: 'auth', token }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'initial-users') setUsers(data.users);
      if (data.type === 'user-update') {
        setUsers(prev => {
          const idx = prev.findIndex(u => u._id === data.user._id);
          if (idx >= 0) {
            prev[idx] = data.user;
            return [...prev];
          } else {
            return [...prev, data.user];
          }
        });
      }
    };

    ws.onclose = () => console.log('WebSocket déconnecté');
    ws.onerror = (err) => console.error('Erreur WebSocket:', err);

    return () => ws.close();
  }, [token]);

  return { users, socket };
}
