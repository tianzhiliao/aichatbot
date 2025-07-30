# 🤖 多模型聊天机器人

一个现代化的 React 聊天应用，支持多个大语言模型切换，提供流畅的对话体验。

![技术栈](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7.4-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.1.6-blue)

## ✨ 功能特性

- 🔄 **多模型支持**: 轻松切换 Kimi K2 和 DeepSeek R1 模型
- 💬 **智能对话**: 完整的对话记忆和上下文理解
- 🎨 **现代 UI**: 基于 Tailwind CSS 的简洁现代设计
- ⚡ **实时体验**: 流式响应，实时显示AI回复
- 🛡️ **错误处理**: 完善的错误边界和重试机制
- 📱 **响应式设计**: 完美适配桌面和移动设备
- ♿ **无障碍支持**: 支持键盘导航和屏幕阅读器
- 🔒 **安全可靠**: API 密钥本地存储，请求超时控制

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <your-repo-url>
cd "my first AI chatbot"
```

2. **安装依赖**
```bash
npm install
```

3. **配置 API 密钥**

由于项目使用本地存储管理 API 密钥，首次运行时应用会引导您输入密钥：

- **Kimi API**: 访问 [Moonshot AI](https://platform.moonshot.cn/) 获取 API 密钥
- **DeepSeek API**: 访问 [DeepSeek](https://platform.deepseek.com/) 获取 API 密钥

4. **启动开发服务器**
```bash
npm start
```

5. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🎯 使用指南

### 基本使用

1. **选择模型**: 点击右上角的模型选择器切换 AI 模型
2. **开始对话**: 在底部输入框输入消息并按回车键
3. **查看历史**: 左侧面板显示所有对话历史
4. **管理对话**: 点击对话项可以切换，长按可删除

### 键盘快捷键

- `Enter`: 发送消息
- `Shift + Enter`: 换行
- `Ctrl/Cmd + K`: 新建对话
- `Escape`: 清除输入框

### 支持的模型

| 模型 | 提供商 | 特点 | 适用场景 |
|------|--------|------|----------|
| **Kimi K2** | Moonshot AI | 长文本理解，中文优化 | 文档分析、中文对话 |
| **DeepSeek R1** | DeepSeek | 推理能力强，逻辑清晰 | 代码编写、逻辑推理 |

## 🔧 配置说明

### API 密钥管理

项目支持两种配置方式：

#### 方式一：应用内配置（推荐）
- 首次启动时会提示输入 API 密钥
- 密钥存储在浏览器本地存储中
- 可在设置中随时修改

#### 方式二：环境变量配置
创建 `.env.local` 文件：
```bash
# Kimi API 配置
REACT_APP_KIMI_API_KEY=your_kimi_api_key_here

# DeepSeek API 配置  
REACT_APP_DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 高级配置

模型参数可在 `src/constants/models.ts` 中调整：

```typescript
export const MODELS = {
  kimi: {
    name: 'Kimi K2',
    endpoint: 'https://api.moonshot.cn/v1/chat/completions',
    modelName: 'kimi-k2-0711-preview',
    maxTokens: 4000,
    temperature: 0.6
  },
  // ...
};
```

## 📦 构建和部署

### 开发构建
```bash
npm start
```

### 生产构建
```bash
npm run build
```

生成的文件在 `build/` 目录，可直接部署到静态网站托管服务。

### 部署选项

#### Vercel 部署
```bash
npm install -g vercel
vercel --prod
```

#### Netlify 部署
```bash
npm run build
# 将 build/ 目录拖拽到 Netlify 部署界面
```

#### Docker 部署
```dockerfile
FROM nginx:alpine
COPY build/ /usr/share/nginx/html/
EXPOSE 80
```

## 🛠️ 开发指南

### 项目架构

本项目采用模块化架构设计，详细信息请参考 [ARCHITECTURE.md](./ARCHITECTURE.md)。

### 目录结构
```
src/
├── components/           # UI组件
├── hooks/               # 自定义Hooks
├── api/                 # API层
├── types/               # 类型定义
├── constants/           # 常量配置
├── utils/               # 工具函数
└── App.tsx             # 主应用组件
```

### 开发命令

```bash
npm start          # 启动开发服务器
npm run build      # 构建生产版本
npm test           # 运行测试
npm run eject      # 弹出 CRA 配置（不推荐）
```

## 🔍 故障排除

### 常见问题

#### API 密钥无效
**症状**: 提示 "API key invalid" 或请求失败
**解决方案**: 
1. 检查 API 密钥是否正确输入
2. 确认密钥是否有效且有余额
3. 检查网络连接

#### 模型响应慢
**症状**: AI 回复时间过长
**解决方案**:
1. 检查网络状况
2. 尝试切换其他模型
3. 减少输入文本长度

#### 页面无法加载
**症状**: 白屏或加载错误
**解决方案**:
1. 清除浏览器缓存
2. 检查浏览器控制台错误
3. 确认 Node.js 版本 >= 16

### 获取帮助

- 🐛 [报告 Bug](https://github.com/your-repo/issues)
- 💡 [功能建议](https://github.com/your-repo/discussions)
- 📧 技术支持：tianzhi.liao@gmail.com

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 提交信息使用规范格式

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🎉 致谢

- [React](https://reactjs.org/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架  
- [Lucide React](https://lucide.dev/) - 图标库
- [Moonshot AI](https://www.moonshot.cn/) - Kimi API
- [DeepSeek](https://www.deepseek.com/) - DeepSeek API

---

<div align="center">
  <p>⭐ 如果这个项目对你有帮助，请给个 Star！</p>
  <p>Made with ❤️ by Tianzhi & AI</p>
</div>