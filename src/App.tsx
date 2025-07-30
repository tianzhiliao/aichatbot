import React, { useState, useRef, useEffect } from 'react';
import { Plus, Bot, Settings } from 'lucide-react';

// 导入新的架构组件
import {
  ErrorBoundary,
  ConversationItem,
  MessageItem,
  ChatInput,
  ModelSelector,
  LoadingIndicator,
  WelcomeScreen,
  EmptyConversationList,
  ApiKeySettings
} from './components';

// 导入自定义hooks
import { useConversations } from './hooks/useConversations';
import { useChat } from './hooks/useChat';

// 导入类型和常量
import { ModelType } from './types';
import { MODELS, DEFAULT_MODEL } from './constants/models';
import { UI_CONSTANTS } from './constants/models';

export default function MultiModelChatbot() {
  // 状态管理
  const [selectedModel, setSelectedModel] = useState<ModelType>(DEFAULT_MODEL);
  const [inputMessage, setInputMessage] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自定义hooks
  const {
    conversations,
    currentConversation,
    currentConversationId,
    createNewConversation,
    deleteConversation,
    addMessageToConversation,
    setCurrentConversationId
  } = useConversations();

  const { 
    isLoading, 
    error, 
    sendMessage: sendChatMessage,
    clearError
  } = useChat({
    onMessageSent: (message) => {
      // 如果没有当前对话，创建新的
      let conversationId = currentConversationId;
      if (!currentConversation) {
        const newConv = createNewConversation(message.content);
        conversationId = newConv.id;
      }
      addMessageToConversation(conversationId, message);
    },
    onResponseReceived: (message) => {
      const targetId = currentConversationId || conversations[0]?.id;
      if (targetId) {
        addMessageToConversation(targetId, message);
      }
    }
  });

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: UI_CONSTANTS.SCROLL_BEHAVIOR 
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageContent = inputMessage.trim();
    setInputMessage('');
    clearError();

    try {
      await sendChatMessage(
        messageContent,
        selectedModel,
        currentConversation?.messages || []
      );
    } catch (err) {
      console.error('发送消息失败:', err);
    }
  };

  // 键盘快捷键处理
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理删除快捷键
      if (document.activeElement?.tagName === 'TEXTAREA') return;
      
      // Ctrl+K / Cmd+K 新建对话
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        createNewConversation();
        return;
      }
      
      // Delete/Backspace 删除当前对话
      if ((e.key === 'Delete' || e.key === 'Backspace') && currentConversationId) {
        if (window.confirm('确定要删除当前对话吗？')) {
          deleteConversation(currentConversationId);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentConversationId, deleteConversation, createNewConversation]);

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50">
        {/* 左侧边栏 */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => createNewConversation()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              aria-label="创建新对话"
            >
              <Plus size={16} />
              新对话
            </button>
          </div>

          {/* 对话列表 */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={currentConversationId === conversation.id}
                  onClick={() => setCurrentConversationId(conversation.id)}
                  onDelete={deleteConversation}
                />
              ))
            ) : (
              <EmptyConversationList />
            )}
          </div>
        </div>

        {/* 主聊天区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部栏 */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot size={20} className="text-gray-600" />
                <h1 className="text-lg font-medium">多模型聊天助手</h1>
              </div>
              
              <div className="flex items-center gap-3">
                {/* 模型选择器 */}
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  models={MODELS}
                />
                
                {/* 设置按钮 */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="API密钥设置"
                  aria-label="打开设置"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentConversation?.messages.length ? (
              currentConversation.messages.map(message => (
                <MessageItem
                  key={message.id}
                  message={message}
                  models={MODELS}
                />
              ))
            ) : (
              <WelcomeScreen />
            )}
            
            {isLoading && <LoadingIndicator />}
            
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* API密钥设置弹窗 */}
      <ApiKeySettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={() => {
          // 保存后可以刷新可用模型列表等
          console.log('API密钥已更新');
        }}
      />
    </ErrorBoundary>
  );
}