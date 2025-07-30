// 模型类型
export type ModelType = 'kimi' | 'deepseek';

// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: ModelType;
}

// 对话类型
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

// 模型配置类型
export interface ModelConfig {
  name: string;
  color: string;
  endpoint: string;
  modelName: string;
  maxTokens?: number;
  temperature?: number;
}

// API 请求类型
export interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface APIRequest {
  model: string;
  messages: APIMessage[];
  temperature?: number;
  max_tokens?: number;
}

// API 响应类型
export interface APIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// 错误类型将在 api/chatApi.ts 中定义

// React 组件 Props 类型
export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export interface MessageItemProps {
  message: Message;
  models: Record<ModelType, ModelConfig>;
}

export interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  models: Record<ModelType, ModelConfig>;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
} 