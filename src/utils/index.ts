import { UI_CONSTANTS } from '../constants/models';

// 生成唯一ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 生成对话标题
export const generateConversationTitle = (message: string): string => {
  const trimmed = message.trim();
  if (trimmed.length <= UI_CONSTANTS.MAX_TITLE_LENGTH) {
    return trimmed;
  }
  return `${trimmed.slice(0, UI_CONSTANTS.MAX_TITLE_LENGTH)}...`;
};

// 格式化时间
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 延迟函数
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 验证API密钥格式
export const validateApiKey = (key: string | undefined): boolean => {
  return Boolean(key && key.trim().length > 0);
};

// 错误消息处理
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return '未知错误';
}; 