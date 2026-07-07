# DevProxy

<div align="center">

**面向前端开发者的 Chrome 调试扩展，用于请求改写、脚本替换、JS 重定向、代理切换和多场景管理。**

![Extension Version](https://img.shields.io/badge/extension-v1.9-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

[English](README.md) · [中文](README.zh-CN.md)

[功能](#-功能) • [使用方式](#-使用方式) • [使用场景](#-使用场景) • [权限说明](#-权限说明) • [隐私说明](#-隐私说明)

</div>

---

## 项目简介

DevProxy 是一款面向前端开发者和测试人员的 Chrome 扩展。它支持请求 Header 修改、路由替换、JavaScript 文件替换、JS 请求重定向、代理服务器配置和多场景切换。

它的价值在于：用户不需要频繁修改项目代码、系统代理或后端环境，就能在 Chrome 中快速模拟请求、替换资源、切换代理并复现线上问题。常用调试规则可以保存为不同场景，在需要时启用，完成后暂停，减少重复配置和误操作。

---

## ✨ 功能

### Header 修改
- 添加或覆盖自定义 HTTP 请求头。
- 支持按 URL 匹配限制规则生效范围。
- 适合注入认证 Token、语言标识、调试开关或测试后端策略。

### 路由替换
- 将匹配源 URL 前缀的请求替换到目标 URL 前缀。
- 可把线上或测试环境 API 指向本地开发服务。
- 支持多规则配置，每条规则可独立启用或禁用。

### 脚本替换
- 拦截指定 JavaScript 文件并替换为自定义内容。
- 适合验证修复、测试第三方脚本行为或调试生产页面。
- 支持多条脚本替换规则。

### JS 重定向
- 将指定 JavaScript 文件请求重定向到另一个 URL。
- 可让真实页面加载本地或测试版本脚本，无需修改页面源码。
- 支持多条重定向规则独立管理。

### 代理服务器
- 支持系统代理、直接连接和自定义代理服务器。
- 代理模式切换即时生效。
- 推荐配合 [whistle](https://github.com/avwo/whistle) 进行网络调试。

### 场景配置
- 为本地开发、测试环境、生产排查或临时问题保存不同规则组合。
- 支持快速启用、暂停、复制、重命名和切换场景。

---

## 📦 安装

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0 或 pnpm

### 本地安装

1. 克隆仓库

```bash
git clone https://github.com/Note-rc/DevProxy.git
cd DevProxy
```

2. 安装依赖

```bash
npm install
# 或
pnpm install
```

3. 构建扩展

```bash
npm run build
# 或
pnpm build
```

4. 加载到 Chrome

- 打开 `chrome://extensions/`。
- 启用开发者模式。
- 点击「加载已解压的扩展程序」。
- 选择生成的 `dist` 目录。

### 开发模式

```bash
npm run dev
npm run watch
```

---

## 📖 使用方式

1. 点击 Chrome 工具栏中的 DevProxy 图标。
2. 选择需要使用的功能：Header、Route、Script、Redirect 或 Proxy。
3. 添加对应规则或代理配置。
4. 启用规则并刷新目标页面。
5. 如需集中管理多条规则，可进入配置中心维护完整规则和场景。

---

## 🎯 使用场景

### 1. 本地复现线上问题

使用 JS 重定向，将线上 JavaScript 文件指向本地开发服务。

```text
源 JS：https://cdn.example.com/app.min.js
目标 JS：http://localhost:3000/app.js
```

### 2. 将线上 API 指向本地服务

使用路由替换，将匹配的 API 请求转发到本地后端。

```text
源路由：https://api.example.com/v1
目标路由：http://localhost:8080/v1
```

### 3. 添加调试 Header

使用 Header 修改，为指定请求添加调试标识、Token 或语言头。

```text
Header 名称：X-Debug-Mode
Header 值：true
URL 匹配：api.example.com
```

### 4. 配合 whistle 抓包调试

本地启动 whistle 后，将 DevProxy 设置为使用本地代理服务器。

```text
代理主机：127.0.0.1
代理端口：8899
```

### 5. 切换调试场景

为本地开发、测试验证和生产排查分别创建场景。启用所需场景，调试完成后暂停即可。

---

## 🔐 权限说明

DevProxy 申请的权限仅用于完成用户主动配置的开发调试行为。

| 权限 | 用途 |
| --- | --- |
| `storage` | 将用户创建的规则、代理配置、语言偏好和场景配置保存在 Chrome 本地存储中。 |
| `declarativeNetRequest` | 根据用户配置执行 Header 修改、请求重定向和路由替换。 |
| `proxy` | 在系统代理、直接连接和用户自定义代理服务器之间切换。 |
| `<all_urls>` | 让用户创建的规则可以作用于需要调试的网站。规则仅在用户配置并启用后生效。 |

---

## 🛡️ 隐私说明

DevProxy 是一个本地开发调试工具，不内置分析 SDK、广告追踪、遥测或第三方数据出售行为。

- 规则和偏好设置保存在 Chrome 本地存储中。
- 请求改写只根据用户主动创建并启用的规则执行。
- DevProxy 默认不会将浏览记录、请求内容或保存的规则上传到外部服务器。
- 用户可以随时禁用、删除或暂停规则。

---

## 🧾 Chrome 应用商店审核说明

### 扩展的用途是什么？

DevProxy 是一款面向前端调试的 Chrome 开发者工具扩展。它帮助用户在 Chrome 中直接修改请求头、替换匹配路由、替换 JavaScript 内容、重定向 JavaScript 资源，以及切换代理设置。

其价值在于：开发者无需反复修改应用代码、后端设置或操作系统代理配置，即可复现生产问题、测试本地服务并切换调试环境。

### 用户应如何使用本扩展？

用户点击 DevProxy 工具栏图标，选择功能标签页，添加所需规则并启用，然后刷新目标页面。常见用法包括：将生产 API 请求路由到本地服务器、为指定请求添加调试 Header、将生产 JavaScript 重定向到本地文件，以及使用本地 whistle 代理进行流量调试。

---

## 🌐 官网 / 宣传页

本仓库包含独立的宣传页，用于商店审核和产品介绍：

```text
website/
```

将 `website/` 目录整体部署到任意静态托管服务即可，其中包含 `index.html` 及 `website/assets/` 下的所需资源。

---

## 🌐 国际化

DevProxy 支持中英双语。界面语言会根据浏览器语言自动选择，默认回退到英语。

---

## 📝 注意事项

1. DevProxy 主要用于开发和调试场景。
2. 规则不再需要时应及时禁用或暂停。
3. 保持规则集简洁，避免不必要的请求处理开销。
4. 仅对你有权限调试的网站和环境添加规则。

---

## 🐛 常见问题

### 规则不生效怎么办？

请确认规则已启用、URL 匹配正确，并在保存规则后刷新目标页面。

### 可以同时使用多个功能吗？

可以。Header、Route、Script、Redirect 和 Proxy 相互独立，可以组合到同一个场景中使用。

### 推荐配合什么代理工具？

推荐配合 [whistle](https://github.com/avwo/whistle) 使用，用于 HTTP、HTTPS、WebSocket 和请求响应调试。

---

## 🤝 贡献

欢迎提交 issue 或 pull request。

---

## 📄 开源协议

本项目根据 package metadata 使用 ISC 协议。

---

## ⚠️ 免责声明

本扩展仅用于授权范围内的开发和调试。用户需要对自己配置和使用请求改写、脚本替换和代理规则的行为负责。

---

## 🔗 相关链接

- [whistle - 跨平台网络调试工具](https://github.com/avwo/whistle)
- [Chrome 扩展程序文档](https://developer.chrome.com/docs/extensions/)
- [GitHub Issues](https://github.com/Note-rc/DevProxy/issues)

<div align="center">

**为需要在真实浏览器环境中调试的开发者而生。**

</div>
