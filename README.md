# DevProxy

<div align="center">

**A lightweight Chrome extension for front-end debugging, request rewriting, JavaScript replacement, and proxy switching.**

![Extension Version](https://img.shields.io/badge/extension-v1.9-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![License](https://img.shields.io/badge/license-ISC-yellow.svg)

[English](README.md) · [中文](README.zh-CN.md)

[Features](#-features) • [Usage](#-usage) • [Use Cases](#-use-cases) • [Permissions](#-permissions) • [Privacy](#-privacy)

</div>

---

## Overview

DevProxy is a Chrome extension designed for front-end developers and QA engineers. It helps users modify request headers, replace matching routes, replace JavaScript file content, redirect JavaScript resources, switch proxy modes, and save different debugging setups as profiles.

Instead of repeatedly changing application code, system proxy settings, or backend configuration, DevProxy lets Chrome users create local browser-side rules for development and debugging. Rules can be enabled, disabled, and grouped into scenes, making it easier to reproduce production issues, debug local services, and switch between environments.

---

## ✨ Features

### Header Modify
- Add or override custom HTTP request headers.
- Limit header rules to specific URL patterns.
- Useful for auth tokens, language simulation, debug flags, and backend behavior testing.

### Route Replace
- Replace requests that match a source URL prefix with a target URL prefix.
- Redirect production or staging API calls to local development services.
- Supports multiple independently enabled or disabled rules.

### Script Replace
- Intercept a specified JavaScript file and replace its content.
- Useful for verifying fixes, testing third-party script behavior, or debugging production pages.
- Supports multiple replacement rules.

### JS Redirect
- Redirect a specified JavaScript file request to another URL.
- Load local or staging JavaScript on a real page without changing page source code.
- Supports multiple independently managed redirect rules.

### Proxy Server
- Switch between system proxy, direct connection, and custom proxy server.
- Apply proxy settings immediately.
- Recommended with [whistle](https://github.com/avwo/whistle) for network debugging.

### Scene Profiles
- Save different groups of rules for local, staging, production debugging, or temporary investigations.
- Enable, pause, duplicate, rename, and switch scenes quickly.

---

## 📦 Installation

### Requirements
- Node.js >= 14.0.0
- npm >= 6.0.0 or pnpm

### Local Installation

1. Clone the repository

```bash
git clone https://github.com/Note-rc/DevProxy.git
cd DevProxy
```

2. Install dependencies

```bash
npm install
# or
pnpm install
```

3. Build the extension

```bash
npm run build
# or
pnpm build
```

4. Load into Chrome

- Open `chrome://extensions/`.
- Enable Developer mode.
- Click "Load unpacked".
- Select the generated `dist` directory.

### Development

```bash
npm run dev
npm run watch
```

---

## 📖 Usage

1. Click the DevProxy icon in the Chrome toolbar.
2. Choose a feature tab: Header, Route, Script, Redirect, or Proxy.
3. Add the rule or proxy configuration you need.
4. Enable the rule and refresh the target page.
5. Use the configuration center to manage larger rule sets and scene profiles.

---

## 🎯 Use Cases

### 1. Debug production issues locally

Use JS Redirect to point a production JavaScript file to a local development server.

```text
Source JS: https://cdn.example.com/app.min.js
Target JS: http://localhost:3000/app.js
```

### 2. Route production API calls to a local server

Use Route Replace to forward matching API requests to a local backend.

```text
Source route: https://api.example.com/v1
Target route: http://localhost:8080/v1
```

### 3. Add debugging headers

Use Header Modify to add a debug flag, token, or locale header to selected requests.

```text
Header name: X-Debug-Mode
Header value: true
URL match: api.example.com
```

### 4. Debug traffic with whistle

Start whistle locally, then set DevProxy to use the local proxy server.

```text
Proxy host: 127.0.0.1
Proxy port: 8899
```

### 5. Switch between debugging scenes

Create separate scenes for local development, staging validation, and production investigation. Enable the scene you need and pause it after the debugging task is complete.

---

## 🔐 Permissions

DevProxy requests only the permissions required for user-configured debugging behavior.

| Permission | Why it is needed |
| --- | --- |
| `storage` | Save user-created rules, proxy settings, language preference, and scene profiles locally in Chrome. |
| `declarativeNetRequest` | Apply header modification, request redirection, and route replacement rules configured by the user. |
| `proxy` | Switch Chrome between system proxy, direct connection, and a user-defined proxy server. |
| `<all_urls>` | Allow user-created rules to work on the websites the user chooses to debug. Rules only take effect when configured and enabled by the user. |

---

## 🛡️ Privacy

DevProxy is a local development tool. It does not include analytics SDKs, advertising trackers, telemetry, or third-party data selling behavior.

- Rules and preferences are stored in Chrome local storage.
- Request rewriting happens according to user-created rules.
- DevProxy does not upload browsing history, request content, or saved rules to an external server by default.
- Users can disable, delete, or pause rules at any time.

---

## 🧾 Chrome Web Store Review Notes

### What is the purpose of this extension?

DevProxy is a Chrome developer tool extension for front-end debugging. It helps users modify request headers, replace matching routes, replace JavaScript content, redirect JavaScript resources, and switch proxy settings directly in Chrome.

Its value is that developers can reproduce production issues, test local services, and switch debugging environments without repeatedly changing application code, backend settings, or operating system proxy configuration.

### How should users use this extension?

Users click the DevProxy toolbar icon, choose a feature tab, add the rule they need, enable it, and refresh the target page. Common examples include routing production API calls to a local server, adding debug headers to selected requests, redirecting production JavaScript to a local file, and using a local whistle proxy for traffic debugging.

---

## 🌐 Website / Promotional Page

This repository includes a standalone promotional page for store review and product introduction:

```text
website/
```

Deploy the `website/` directory as-is to any static hosting provider. It contains `index.html` and the required assets under `website/assets/`.

---

## 🌐 Internationalization

DevProxy supports English and Chinese. The interface language is detected from the browser locale, with English as the default fallback.

---

## 📝 Notes

1. DevProxy is primarily intended for development and debugging.
2. Disable or pause rules when they are no longer needed.
3. Keep rule sets concise to avoid unnecessary request processing.
4. Only add rules for websites and environments you are authorized to debug.

---

## 🐛 FAQ

### Rules do not take effect. What should I check?

Check whether the rule is enabled, whether the URL match is correct, and whether the target page has been refreshed after saving the rule.

### Can multiple features be used together?

Yes. Header, Route, Script, Redirect, and Proxy features are independent and can be combined in one scene.

### Which proxy tool is recommended?

[whistle](https://github.com/avwo/whistle) is recommended for HTTP, HTTPS, WebSocket, and request/response debugging.

---

## 🤝 Contributing

Issues and pull requests are welcome.

---

## 📄 License

This project is licensed under ISC according to the package metadata.

---

## ⚠️ Disclaimer

This extension is intended for authorized development and debugging only. Users are responsible for how they configure and use request rewriting, script replacement, and proxy rules.

---

## 🔗 Links

- [whistle - Cross-platform Network Debugging Tool](https://github.com/avwo/whistle)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [GitHub Issues](https://github.com/Note-rc/DevProxy/issues)

<div align="center">

**Built for developers who debug in the real browser.**

</div>
