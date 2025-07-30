import { ModelType, APIRequest, APIResponse, Message } from '../types';
import { MODELS, API_TIMEOUTS } from '../constants/models';
import { validateApiKey, getErrorMessage, delay } from '../utils';

class ChatAPI {
  private getApiKey(modelType: ModelType): string {
    // 首先尝试从本地存储获取API密钥
    const localStorageKey = modelType === 'kimi' 
      ? 'chatbot_kimi_api_key' 
      : 'chatbot_deepseek_api_key';
    
    const localKey = localStorage.getItem(localStorageKey);
    
    // 如果本地存储有密钥且有效，使用本地密钥
    if (validateApiKey(localKey || undefined)) {
      return localKey!;
    }
    
    // 否则尝试从环境变量获取
    const envKey = modelType === 'kimi' 
      ? process.env.REACT_APP_KIMI_API_KEY 
      : process.env.REACT_APP_DEEPSEEK_API_KEY;
    
    if (validateApiKey(envKey)) {
      return envKey!;
    }
    
    throw new APIError(`请配置 ${MODELS[modelType].name} API密钥`, 401, 'MISSING_API_KEY');
  }

  // 设置API密钥到本地存储
  setApiKey(modelType: ModelType, apiKey: string): void {
    if (!validateApiKey(apiKey)) {
      throw new APIError('API密钥格式无效');
    }
    
    const localStorageKey = modelType === 'kimi' 
      ? 'chatbot_kimi_api_key' 
      : 'chatbot_deepseek_api_key';
    
    localStorage.setItem(localStorageKey, apiKey.trim());
  }

  // 删除API密钥
  removeApiKey(modelType: ModelType): void {
    const localStorageKey = modelType === 'kimi' 
      ? 'chatbot_kimi_api_key' 
      : 'chatbot_deepseek_api_key';
    
    localStorage.removeItem(localStorageKey);
  }

  private async makeRequest(
    modelType: ModelType, 
    request: APIRequest,
    retryCount = 0
  ): Promise<APIResponse> {
    const config = MODELS[modelType];
    const apiKey = this.getApiKey(modelType);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUTS.REQUEST_TIMEOUT);

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          ...request,
          model: config.modelName,
          temperature: config.temperature,
          max_tokens: config.maxTokens
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new APIError(
          `${config.name} API错误: ${response.status} - ${errorText}`,
          response.status
        );
      }

      const data: APIResponse = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new APIError('API返回格式错误');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // 处理中断错误
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new APIError('请求超时，请稍后重试');
      }

      // 重试逻辑
      if (retryCount < API_TIMEOUTS.MAX_RETRIES) {
        await delay(API_TIMEOUTS.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(modelType, request, retryCount + 1);
      }

      throw new APIError(getErrorMessage(error));
    }
  }

  async sendMessage(modelType: ModelType, messages: Message[]): Promise<string> {
    const apiMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const request: APIRequest = {
      model: MODELS[modelType].modelName,
      messages: apiMessages
    };

    try {
      const response = await this.makeRequest(modelType, request);
      return response.choices[0].message.content;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(getErrorMessage(error));
    }
  }

  // 检查API配置是否有效
  isConfigured(modelType: ModelType): boolean {
    try {
      this.getApiKey(modelType);
      return true;
    } catch {
      return false;
    }
  }

  // 获取可用的模型列表
  getAvailableModels(): ModelType[] {
    return Object.keys(MODELS).filter(model => 
      this.isConfigured(model as ModelType)
    ) as ModelType[];
  }
}

// 自定义错误类
class APIError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

// 导出单例实例
export const chatAPI = new ChatAPI();
export { APIError }; 