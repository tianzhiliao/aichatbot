import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';

export const EmptyConversationList = memo(() => {
  return (
    <div className="p-4 text-center text-gray-500">
      <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
      <p className="text-sm">暂无对话记录</p>
      <p className="text-xs text-gray-400 mt-1">点击上方按钮创建新对话</p>
    </div>
  );
});

EmptyConversationList.displayName = 'EmptyConversationList'; 