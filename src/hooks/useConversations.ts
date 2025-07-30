import { useState, useCallback } from 'react';
import { Conversation, Message } from '../types';
import { generateId, generateConversationTitle } from '../utils';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  // 获取当前对话
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // 创建新对话
  const createNewConversation = useCallback((initialMessage?: string) => {
    const newConversation: Conversation = {
      id: generateId(),
      title: initialMessage ? generateConversationTitle(initialMessage) : '新对话',
      messages: [],
      createdAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    return newConversation;
  }, []);

  // 删除对话
  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const remaining = prev.filter(c => c.id !== id);
      
      // 如果删除的是当前对话，切换到第一个对话
      if (currentConversationId === id) {
        setCurrentConversationId(remaining[0]?.id || '');
      }
      
      return remaining;
    });
  }, [currentConversationId]);

  // 添加消息到对话
  const addMessageToConversation = useCallback((
    conversationId: string, 
    message: Message
  ) => {
    setConversations(prev => 
      prev.map(conversation => 
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, message],
              // 如果是第一条用户消息，更新标题
              title: conversation.messages.length === 0 && message.role === 'user'
                ? generateConversationTitle(message.content)
                : conversation.title
            }
          : conversation
      )
    );
  }, []);

  // 更新对话标题
  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations(prev => 
      prev.map(c => c.id === id ? { ...c, title } : c)
    );
  }, []);

  // 清空所有对话
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversationId('');
  }, []);

  // 获取对话统计信息
  const getConversationStats = useCallback(() => {
    const totalMessages = conversations.reduce(
      (total, conv) => total + conv.messages.length, 
      0
    );
    
    return {
      totalConversations: conversations.length,
      totalMessages,
      hasActiveConversation: Boolean(currentConversation)
    };
  }, [conversations, currentConversation]);

  return {
    // 状态
    conversations,
    currentConversation,
    currentConversationId,
    
    // 操作
    createNewConversation,
    deleteConversation,
    addMessageToConversation,
    updateConversationTitle,
    clearAllConversations,
    setCurrentConversationId,
    
    // 工具函数
    getConversationStats
  };
}; 