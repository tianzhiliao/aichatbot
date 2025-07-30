import React, { memo } from 'react';
import { MessageItemProps } from '../types';
import { formatTime } from '../utils';

export const MessageItem = memo<MessageItemProps>(({ message, models }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* 显示模型名称（仅助手消息） */}
        {!isUser && message.model && message.model in models && (
          <div className="text-xs text-gray-500 mb-1">
            {models[message.model].name}
          </div>
        )}
        
        {/* 消息内容 */}
        <div className="whitespace-pre-wrap text-sm">
          {message.content}
        </div>
        
        {/* 时间戳 */}
        <div className={`text-xs mt-1 ${
          isUser ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem'; 