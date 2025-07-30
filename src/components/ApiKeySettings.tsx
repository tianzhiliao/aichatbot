import React, { memo, useState } from 'react';
import { Settings, Key, Save, X } from 'lucide-react';
import { ModelType } from '../types';
import { MODELS } from '../constants/models';
import { chatAPI } from '../api/chatApi';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const ApiKeySettings = memo<ApiKeySettingsProps>(({
  isOpen,
  onClose,
  onSave
}) => {
  const [apiKeys, setApiKeys] = useState<Record<ModelType, string>>({
    kimi: '',
    deepseek: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // 获取当前保存的API密钥状态
  React.useEffect(() => {
    if (isOpen) {
      setApiKeys({
        kimi: chatAPI.isConfigured('kimi') ? '••••••••••••••••' : '',
        deepseek: chatAPI.isConfigured('deepseek') ? '••••••••••••••••' : ''
      });
    }
  }, [isOpen]);

  const handleInputChange = (modelType: ModelType, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [modelType]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 保存非空的API密钥
      Object.entries(apiKeys).forEach(([modelType, key]) => {
        if (key.trim() && !key.includes('••••')) {
          chatAPI.setApiKey(modelType as ModelType, key.trim());
        }
      });
      
      onSave?.();
      onClose();
    } catch (error) {
      console.error('保存API密钥失败:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = (modelType: ModelType) => {
    if (window.confirm(`确定要删除 ${MODELS[modelType].name} 的API密钥吗？`)) {
      chatAPI.removeApiKey(modelType);
      setApiKeys(prev => ({
        ...prev,
        [modelType]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">API密钥设置</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="关闭设置"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6 space-y-4">
          {Object.entries(MODELS).map(([modelType, config]) => (
            <div key={modelType} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <label className="text-sm font-medium text-gray-700">
                  {config.name} API密钥
                </label>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={apiKeys[modelType as ModelType]}
                    onChange={(e) => handleInputChange(modelType as ModelType, e.target.value)}
                    placeholder="请输入API密钥"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {chatAPI.isConfigured(modelType as ModelType) && (
                  <button
                    onClick={() => handleRemove(modelType as ModelType)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm transition-colors"
                    title="删除密钥"
                  >
                    删除
                  </button>
                )}
              </div>
              
              {chatAPI.isConfigured(modelType as ModelType) && (
                <p className="text-xs text-green-600">✓ 已配置</p>
              )}
            </div>
          ))}

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p>• API密钥将安全存储在浏览器本地存储中</p>
            <p>• 不会上传到任何服务器</p>
            <p>• 您可以在模型官网获取API密钥</p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            disabled={isSaving}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
});

ApiKeySettings.displayName = 'ApiKeySettings'; 