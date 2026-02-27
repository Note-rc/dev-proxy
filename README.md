# Dev Proxy

<div align="center">

A powerful Chrome extension designed for front-end developers, providing proxy server configuration, route replacement, script replacement, resource redirection, and Cookie management for development and debugging.

一个功能强大的 Chrome 浏览器扩展，专为前端开发者设计，提供代理服务器配置、路由替换、脚本替换、资源重定向和 Cookie 管理等开发调试功能。

![Version](https://img.shields.io/badge/version-1.9-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

[Features](#-features) • [Installation](#-installation) • [Usage Guide](#-usage-guide) • [Use Cases](#-use-cases)

[功能特性](#-功能特性) • [安装使用](#-安装使用) • [使用指南](#-使用指南) • [使用场景](#-使用场景)

</div>

---

## ✨ Features

### 🚀 Proxy Server
- **Three proxy modes**: System proxy, direct connection, custom proxy
- **Unified proxy configuration**: HTTP, HTTPS, SOCKS and all protocols use the same proxy server
- **Real-time switching**: Proxy mode changes take effect immediately
- **Recommended with [whistle](https://github.com/avwo/whistle)**: A powerful cross-platform network debugging tool

### 🔄 Route Replace
- Automatically intercept and replace matching URL prefixes
- Supports multiple rules, each can be independently enabled/disabled
- Changes take effect immediately after configuration

### 📝 Script Replace
- Intercept specified JavaScript files and replace their content
- Supports injecting custom JavaScript code
- Supports multiple rule management

### 🔀 JS Redirect
- Redirect specified JS file requests to another URL
- Supports multiple rules, each can be independently enabled/disabled

### 🍪 Cookie Management
- Copy cookies between different domains
- Quickly switch between test and production environments

---

## ✨ 功能特性

### 🚀 代理服务器
- **三种代理模式**：系统代理、直接连接、自定义代理
- **统一代理配置**：HTTP、HTTPS、SOCKS 等所有协议统一使用同一代理服务器
- **实时切换**：代理模式切换即时生效
- **推荐配合 [whistle](https://github.com/avwo/whistle) 使用**：whistle 是一个功能强大的跨平台网络调试工具

### 🔄 路由替换
- 自动拦截并替换匹配的 URL 前缀
- 支持多规则配置，每条规则可独立启用/禁用
- 配置修改后立即生效

### 📝 脚本替换
- 拦截指定 JavaScript 文件并替换其内容
- 支持注入自定义的 JavaScript 代码
- 支持多规则管理

### 🔀 JS 重定向
- 将指定的 JS 文件重定向到另一个 URL
- 支持多规则配置，每个规则可单独启用/禁用

### 🍪 Cookie 管理
- 在不同域名之间复制 Cookie
- 快速切换测试环境和生产环境

---

## 📦 Installation

### Requirements / 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0 or pnpm

### Local Installation / 本地安装

1. **Clone the repository / 克隆仓库**
```bash
git clone https://github.com/yourusername/dev-chrome-extension.git
cd dev-chrome-extension
```

2. **Install dependencies / 安装依赖**
```bash
npm install
# or use pnpm / 或使用 pnpm
pnpm install
```

3. **Development mode / 开发模式运行**
```bash
# Development build (single) / 开发模式（单次构建）
npm run dev

# Watch mode / 开发模式（监听文件变化）
npm run watch
```

4. **Production build / 生产构建**
```bash
npm run build
```

5. **Load into Chrome / 加载到 Chrome 浏览器**
   - Open Chrome browser / 打开 Chrome 浏览器
   - Navigate to `chrome://extensions/` / 访问 `chrome://extensions/`
   - Enable "Developer mode" in top right / 开启右上角的"开发者模式"
   - Click "Load unpacked" / 点击"加载已解压的扩展程序"
   - Select the `dist` folder / 选择项目中的 `dist` 文件夹

---

## 📖 Usage Guide

### Proxy Server Configuration / 代理服务器配置

1. Click the extension icon to open the popup / 点击扩展图标打开弹窗
2. Switch to the "Proxy" tab / 切换到"代理"标签
3. Select proxy mode / 选择代理模式：
   - **System Proxy / 系统代理**: Use system proxy settings / 使用系统配置的代理设置
   - **Direct Connection / 直接连接**: Connect directly without proxy / 不使用代理，直接连接
   - **Custom Mode / 自定义模式**: Use custom proxy server / 使用自定义代理服务器
4. For custom mode, fill in the proxy server address and port / 如果选择自定义模式，填写代理服务器地址和端口
5. Recommended with [whistle](https://github.com/avwo/whistle) (default port 8899) / 建议配合 whistle 使用（默认端口 8899）

### Route Replace Configuration / 路由替换配置

1. Switch to the "Route" tab / 切换到"路由替换"标签
2. Click "Add New Rule" / 点击"添加新规则"
3. Fill in source and target route prefixes / 填写源路由前缀和目标路由前缀
4. Use the checkbox to enable/disable rules / 保存后使用复选框控制规则的启用/禁用

**Example / 示例**：
```
Source / 源路由: https://api.production.com/v1
Target / 目标路由: http://localhost:8080/api/v1
```

### Script Replace Configuration / 脚本替换配置

1. Switch to the "Script" tab / 切换到"脚本替换"标签
2. Click "Add New Rule" / 点击"添加新规则"
3. Fill in the script URL and replacement content (JavaScript code) / 填写脚本 URL 和替换内容
4. Save and enable the rule / 保存并启用规则

### JS Redirect Configuration / JS 重定向配置

1. Switch to the "Redirect" tab / 切换到"JS重定向"标签
2. Click "Add New Rule" / 点击"添加新规则"
3. Fill in source and target JS URLs / 填写源 JS URL 和目标 JS URL
4. Save the rule / 保存规则

**Example / 示例**：
```
Source JS / 源 JS: https://cdn.example.com/app.min.js
Target JS / 目标 JS: http://localhost:3000/app.js
```

### Cookie Management / Cookie 管理

1. Switch to the "Cookie" tab / 切换到"Cookie"标签
2. Fill in source and target domains / 填写源域名和目标域名
3. Click "Copy Cookie" / 点击"复制 Cookie"

---

## 🎯 Use Cases

### Scenario 1: Network debugging with whistle / 配合 whistle 进行网络调试

1. Start whistle proxy server (default port 8899) / 启动 whistle 代理服务器
2. Configure proxy server as `127.0.0.1:8899` / 在本扩展中配置代理服务器为 `127.0.0.1:8899`
3. Use whistle for packet capture and request modification / 使用 whistle 进行网络抓包调试

### Scenario 2: Debug production issues locally / 本地调试生产环境问题

1. Use "JS Redirect" / 使用"JS重定向"功能
2. Set source JS to production URL / 配置源 JS 为生产环境的 JS 文件 URL
3. Set target JS to local dev server / 配置目标 JS 为本地开发服务器的 URL
4. Visit production site to load local debug version / 访问生产环境网站，自动加载本地调试版本

### Scenario 3: Cross-origin API debugging / 跨域 API 调试

1. Use "Route Replace" / 使用"路由替换"功能
2. Set source route to production API / 配置源路由为线上 API 地址
3. Set target route to local API server / 配置目标路由为本地 API 服务器
4. All matching requests will be forwarded / 所有匹配的 API 请求将自动转发到本地服务器

### Scenario 4: Sync login state across environments / 测试环境登录态同步

1. Use "Cookie Management" / 使用"Cookie 管理"功能
2. Login on production, configure source and target domains / 在生产环境登录后，配置源域名和目标域名
3. Click "Copy Cookie" / 点击"复制 Cookie"
4. Visit test environment with inherited session / 访问测试环境，自动继承登录态

---

## 🌐 Internationalization / 国际化

This extension supports both English and Chinese. The language is automatically detected based on your browser's locale settings. English is used as the default language.

本扩展支持中英双语。语言会根据浏览器的语言设置自动检测，默认使用英语。

---

## 🤝 Contributing / 贡献指南

Contributions are welcome! / 欢迎贡献代码、报告 bug 或提出新功能建议！

1. Fork this repository / Fork 本仓库
2. Create a feature branch / 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. Commit your changes / 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch / 推送到分支 (`git push origin feature/AmazingFeature`)
5. Open a Pull Request / 提交 Pull Request

---

## 📝 Notes / 注意事项

1. **Security / 安全性**: This extension requires elevated permissions (`<all_urls>`). Only install from trusted sources. / 本扩展需要较高的权限，请确保只从可信来源安装
2. **Development use / 开发环境使用**: Primarily for development and debugging. Not recommended for daily browsing. / 本工具主要用于开发调试，不建议在日常浏览时保持启用
3. **Rule management / 规则管理**: Disable or delete unused rules to avoid affecting normal browsing. / 建议及时禁用或删除不需要的规则
4. **Performance / 性能影响**: Too many rules may affect page load performance. Keep rules concise. / 大量规则可能影响页面加载性能，建议保持精简

---

## 🐛 FAQ / 常见问题

### Q: Rules don't take effect? / 规则不生效？
A:
- Check if the rule is enabled / 检查规则是否已启用
- Verify URL matching rules are correct / 确认 URL 匹配规则是否正确
- Try refreshing the page or reloading the extension / 尝试刷新页面或重新加载扩展

### Q: How to view active rules? / 如何查看当前生效的规则？
A: Click the extension icon to view all configured rules / 点击扩展图标查看所有配置的规则

### Q: Can I use multiple features simultaneously? / 可以同时使用多个功能吗？
A: Yes. All features work independently and don't interfere with each other. / 可以。所有功能互不影响。

### Q: Recommended proxy tool? / 推荐使用什么代理工具？
A: We recommend [whistle](https://github.com/avwo/whistle), a powerful cross-platform network debugging tool supporting HTTP, HTTPS, WebSocket and more. / 推荐配合 whistle 使用，支持多种协议的调试。

---

## 📄 License / 开源协议

This project is licensed under the [MIT License](LICENSE). / 本项目采用 MIT 开源协议。

---

## ⚠️ Disclaimer / 免责声明

**The code in this project is primarily AI-assisted. / 本项目代码主要由 AI 辅助生成。**

This extension is for learning and development debugging only. Users are responsible for any consequences of using this extension. Do not use for illegal purposes. / 本扩展仅供学习和开发调试使用。使用本扩展造成的任何后果由使用者自行承担。请勿用于非法用途。

---

## 🔗 Links / 相关链接

- [whistle - Cross-platform Network Debugging Tool / 跨平台网络调试工具](https://github.com/avwo/whistle)
- [Chrome Extension API Documentation / API 文档](https://developer.chrome.com/docs/extensions/)

---

<div align="center">

**If this project helps you, please give it a ⭐ Star!**

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Developers, for Developers

</div>
