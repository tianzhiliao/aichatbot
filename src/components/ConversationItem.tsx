import React, { memo } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import { ConversationItemProps } from '../types';
import { formatTime } from '../utils';

export const ConversationItem = memo<ConversationItemProps>(({
  conversation,
  isActive,
  onClick,
  onDelete
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除此对话吗？')) {
      onDelete(conversation.id);
    }
  };

  return (
    <div
      className={`group p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate" title={conversation.title}>
            {conversation.title}
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
          title="删除对话"
          aria-label={`删除对话: ${conversation.title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">
          {conversation.messages.length} 条消息
        </span>
        <span className="text-xs text-gray-400">
          {formatTime(conversation.createdAt)}
        </span>
      </div>
    </div>
  );
});

ConversationItem.displayName = 'ConversationItem'; 