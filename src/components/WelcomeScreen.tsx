import React, { memo } from 'react';
import { Bot } from 'lucide-react';

export const WelcomeScreen = memo(() => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <Bot size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">欢迎使用多模型聊天助手</h3>
        <p className="text-sm">选择一个模型，然后输入消息开始对话</p>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen'; 