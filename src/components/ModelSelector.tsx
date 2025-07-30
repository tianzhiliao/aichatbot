import React, { memo } from 'react';
import { ModelSelectorProps, ModelType } from '../types';

export const ModelSelector = memo<ModelSelectorProps>(({
  selectedModel,
  onModelChange,
  models
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">模型:</span>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as ModelType)}
        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="选择聊天模型"
      >
        {Object.entries(models).map(([key, model]) => (
          <option key={key} value={key}>
            {model.name}
          </option>
        ))}
      </select>
      <div 
        className={`w-3 h-3 rounded-full ${models[selectedModel].color}`}
        title={models[selectedModel].name}
      />
    </div>
  );
});

ModelSelector.displayName = 'ModelSelector'; 