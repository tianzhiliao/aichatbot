import { ModelConfig, ModelType } from '../types';

export const MODELS: Record<ModelType, ModelConfig> = {
  kimi: {
    name: 'Kimi K2',
    color: 'bg-blue-500',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    modelName: 'kimi-k2-0711-preview',
    maxTokens: 4000,
    temperature: 0.6
  },
  deepseek: {
    name: 'DeepSeek R1',
    color: 'bg-purple-500',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    modelName: 'deepseek-reasoner',
    maxTokens: 4000,
    temperature: 1.3
  }
};

export const DEFAULT_MODEL: ModelType = 'kimi';

// API 相关常量
export const API_TIMEOUTS = {
  REQUEST_TIMEOUT: 30000, // 30秒
  RETRY_DELAY: 1000, // 1秒
  MAX_RETRIES: 3
};

// UI 相关常量
export const UI_CONSTANTS = {
  MAX_TITLE_LENGTH: 30,
  MESSAGE_ANIMATION_DELAY: 100,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior
}; 