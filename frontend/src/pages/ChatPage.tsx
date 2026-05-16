import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { useWorkspace } from '@hooks/useWorkspace';
import { apiClient } from '@services/api';
import { getSocket } from '@services/socket';
import { Button } from '@components/ui';
import { SOCKET_EVENTS } from '@lib/constants';

export const ChatPage = () => {
  const { currentWorkspaceId } = useWorkspace();
  const [messages, setMessages] = useState<unknown[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['chat', currentWorkspaceId],
    queryFn: async () => {
      const { data: res } = await apiClient.get(`/workspaces/${currentWorkspaceId}/chat`);
      return res.data.messages;
    },
    enabled: !!currentWorkspaceId,
  });

  useEffect(() => {
    if (data) setMessages(data);
  }, [data]);

  useEffect(() => {
    const socket = getSocket();
    const onMsg = (payload: { message: unknown }) => setMessages((prev) => [...prev, payload.message]);
    const onTyping = (payload: { isTyping: boolean }) => setTyping(payload.isTyping);
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, onMsg);
    socket.on(SOCKET_EVENTS.CHAT_TYPING, onTyping);
    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, onMsg);
      socket.off(SOCKET_EVENTS.CHAT_TYPING, onTyping);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim() || !currentWorkspaceId) return;
    getSocket().emit('chat:message', { workspaceId: currentWorkspaceId, content: input.trim() });
    setInput('');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <h1 className="mb-4 text-2xl font-bold text-content">Team Chat</h1>
      {typing && <p className="mb-2 text-xs text-content-muted">Someone is typing...</p>}
      <div className="flex-1 overflow-y-auto rounded-xl border border-border bg-surface-elevated p-4">
        {(messages as { _id?: string; content?: string; senderId?: { name?: string } }[]).map((m, i) => (
          <div key={m._id || i} className="mb-3">
            <p className="text-xs font-medium text-brand-600">{m.senderId?.name || 'User'}</p>
            <p className="text-sm text-content">{m.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            getSocket().emit('chat:typing', { workspaceId: currentWorkspaceId, isTyping: true });
          }}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2 text-sm"
        />
        <Button onClick={send}><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};
