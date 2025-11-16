# Dev Proxy - 开发者代理工具扩展

<div align="center">

一个功能强大的 Chrome 浏览器扩展，专为前端开发者设计，提供代理服务器配置、路由替换、脚本替换、资源重定向和 Cookie 管理等开发调试功能。

![Version](https://img.shields.io/badge/version-1.7-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

[功能特性](#功能特性) • [安装使用](#安装使用) • [使用指南](#使用指南) • [使用场景](#使用场景)

</div>

---

## ✨ 功能特性

### 🚀 代理服务器
- **三种代理模式**：系统代理、直接连接、自定义代理
- **统一代理配置**：HTTP、HTTPS、SOCKS 等所有协议统一使用同一代理服务器
- **实时切换**：代理模式切换即时生效
- **推荐配合 [whistle](https://github.com/avwo/whistle) 使用**：whistle 是一个功能强大的跨平台网络调试工具

**使用场景**：
- 配合 whistle 等代理工具进行网络调试
- 快速切换代理服务器
- 开发环境网络配置管理

### 🔄 路由替换
- 自动拦截并替换匹配的 URL 前缀
- 支持多规则配置，每条规则可独立启用/禁用
- 配置修改后立即生效

**使用场景**：
- 将生产环境 API 请求代理到本地开发服务器
- 替换 CDN 资源路径到本地文件路径
- 快速切换不同环境的接口地址

### 📝 脚本替换
- 拦截指定 JavaScript 文件并替换其内容
- 支持注入自定义的 JavaScript 代码
- 支持多规则管理

**使用场景**：
- 调试线上 JavaScript 代码
- 临时修复生产环境 bug
- 注入调试代码或监控脚本

### 🔀 JS 重定向
- 将指定的 JS 文件重定向到另一个 URL
- 支持多规则配置，每个规则可单独启用/禁用

**使用场景**：
- 将线上 JS 文件重定向到本地调试版本
- 加载不同版本的第三方库
- A/B 测试不同的脚本实现

### 🍪 Cookie 管理
- 在不同域名之间复制 Cookie
- 快速切换测试环境和生产环境

**使用场景**：
- 在测试环境和生产环境之间同步登录态
- 快速切换账号进行测试
- 跨域调试场景的身份验证

---

## 📦 安装使用

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0 或 pnpm

### 本地安装

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/dev-chrome-extension.git
cd dev-chrome-extension
```

2. **安装依赖**
```bash
npm install
# 或使用 pnpm
pnpm install
```

3. **开发模式运行**
```bash
# 开发模式（单次构建）
npm run dev

# 开发模式（监听文件变化）
npm run watch
```

4. **生产构建**
```bash
npm run build
```

5. **加载到 Chrome 浏览器**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启右上角的"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `dist` 文件夹

---

## 📖 使用指南

### 代理服务器配置

1. 点击扩展图标打开弹窗
2. 切换到"代理"标签
3. 选择代理模式：
   - **系统代理**：使用系统配置的代理设置
   - **直接连接**：不使用代理，直接连接
   - **自定义模式**：使用自定义代理服务器
4. 如果选择自定义模式，填写代理服务器地址和端口
5. 建议配合 [whistle](https://github.com/avwo/whistle) 使用，先启动 whistle（默认端口 8899），然后填写 whistle 的地址和端口

### 路由替换配置

1. 切换到"路由替换"标签
2. 点击"添加新规则"按钮
3. 填写源路由前缀和目标路由前缀
4. 保存后使用复选框控制规则的启用/禁用

**示例**：
```
源路由: https://api.production.com/v1
目标路由: http://localhost:8080/api/v1
```

### 脚本替换配置

1. 切换到"脚本替换"标签
2. 点击"添加新规则"
3. 填写脚本 URL 和替换内容（JavaScript 代码）
4. 保存并启用规则

### JS 重定向配置

1. 切换到"js重定向"标签
2. 点击"添加新规则"
3. 填写源 JS URL 和目标 JS URL
4. 保存规则

**示例**：
```
源 JS: https://cdn.example.com/app.min.js
目标 JS: http://localhost:3000/app.js
```

### Cookie 管理

1. 切换到"Cookie"标签
2. 填写源域名和目标域名
3. 点击"复制 Cookie"执行操作

---

## 🎯 使用场景

### 场景 1：配合 whistle 进行网络调试

1. 启动 whistle 代理服务器（默认端口 8899）
2. 在本扩展中配置代理服务器为 `127.0.0.1:8899`
3. 使用 whistle 的强大功能进行网络抓包、请求修改等调试

### 场景 2：本地开发调试生产环境问题

1. 使用"JS重定向"功能
2. 配置源 JS 为生产环境的 JS 文件 URL
3. 配置目标 JS 为本地开发服务器的 URL
4. 访问生产环境网站，自动加载本地调试版本

### 场景 3：跨域 API 调试

1. 使用"路由替换"功能
2. 配置源路由为线上 API 地址
3. 配置目标路由为本地 API 服务器
4. 所有匹配的 API 请求将自动转发到本地服务器

### 场景 4：测试环境登录态同步

1. 使用"Cookie 管理"功能
2. 在生产环境登录后，配置源域名和目标域名
3. 点击"复制 Cookie"
4. 访问测试环境，自动继承登录态

---

## 🤝 贡献指南

欢迎贡献代码、报告 bug 或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

---

## 📝 注意事项

1. **安全性**：本扩展需要较高的权限（`<all_urls>`），请确保只从可信来源安装
2. **开发环境使用**：本工具主要用于开发调试，不建议在日常浏览时保持启用
3. **规则管理**：建议及时禁用或删除不需要的规则，避免影响正常浏览
4. **性能影响**：大量规则可能影响页面加载性能，建议保持精简

---

## 🐛 常见问题

### Q: 规则配置后不生效？
A: 
- 检查规则是否已启用（复选框是否勾选）
- 确认 URL 匹配规则是否正确
- 尝试刷新页面或重新加载扩展

### Q: 如何查看当前生效的规则？
A: 点击扩展图标查看所有配置的规则

### Q: 可以同时使用多个功能吗？
A: 可以。所有功能（代理服务器、路由替换、脚本替换、JS重定向、Cookie管理）可以同时使用，它们互不影响。

### Q: 推荐使用什么代理工具？
A: 推荐配合 [whistle](https://github.com/avwo/whistle) 使用，whistle 是一个功能强大的跨平台网络调试工具，支持 HTTP、HTTPS、WebSocket 等多种协议的调试。

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## ⚠️ 免责声明

**本项目代码主要由 AI 辅助生成。**

本扩展仅供学习和开发调试使用。使用本扩展造成的任何后果由使用者自行承担。请勿用于非法用途。

---

## 🔗 相关链接

- [whistle - 跨平台网络调试工具](https://github.com/avwo/whistle)
- [Chrome Extension API 文档](https://developer.chrome.com/docs/extensions/)

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Developers, for Developers

</div>
