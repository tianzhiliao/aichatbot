import React, { memo, useCallback } from 'react';
import { Send } from 'lucide-react';
import { ChatInputProps } from '../types';

export const ChatInput = memo<ChatInputProps>(({
  value,
  onChange,
  onSend,
  isLoading
}) => {
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }, [onSend]);

  const handleSend = useCallback(() => {
    if (!value.trim() || isLoading) return;
    onSend();
  }, [value, isLoading, onSend]);

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          className="flex-1 min-h-[40px] max-h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
          rows={1}
          aria-label="输入消息"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="发送消息"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput'; 