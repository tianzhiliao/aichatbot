import { useState, useCallback } from 'react';
import { Message, ModelType } from '../types';
import { chatAPI, APIError } from '../api/chatApi';
import { generateId } from '../utils';

interface UseChatOptions {
  onMessageSent?: (message: Message) => void;
  onResponseReceived?: (message: Message) => void;
  onError?: (error: string) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 发送消息
  const sendMessage = useCallback(async (
    content: string,
    model: ModelType,
    conversationHistory: Message[] = []
  ): Promise<{ userMessage: Message; assistantMessage?: Message; error?: string }> => {
    if (!content.trim()) {
      return { userMessage: createUserMessage(content) };
    }

    setIsLoading(true);
    setError(null);

    const userMessage = createUserMessage(content);
    options.onMessageSent?.(userMessage);

    try {
      // 构建完整的对话历史
      const messages = [...conversationHistory, userMessage];
      
      // 调用API
      const responseContent = await chatAPI.sendMessage(model, messages);
      
      // 创建助手消息
      const assistantMessage = createAssistantMessage(responseContent, model);
      options.onResponseReceived?.(assistantMessage);

      return { userMessage, assistantMessage };
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : '发送消息失败，请稍后重试';
      
      setError(errorMessage);
      options.onError?.(errorMessage);

      // 不创建错误消息，只返回用户消息和错误信息
      return { 
        userMessage, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // 创建用户消息
  const createUserMessage = (content: string): Message => ({
    id: generateId(),
    role: 'user',
    content: content.trim(),
    timestamp: new Date()
  });

  // 创建助手消息
  const createAssistantMessage = (content: string, model: ModelType): Message => ({
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date(),
    model
  });

  // 清除错误状态
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 检查模型是否可用
  const isModelAvailable = useCallback((model: ModelType): boolean => {
    return chatAPI.isConfigured(model);
  }, []);

  // 获取可用模型列表
  const getAvailableModels = useCallback((): ModelType[] => {
    return chatAPI.getAvailableModels();
  }, []);

  return {
    // 状态
    isLoading,
    error,
    
    // 操作
    sendMessage,
    clearError,
    
    // 工具函数
    isModelAvailable,
    getAvailableModels,
    createUserMessage,
    createAssistantMessage
  };
}; 