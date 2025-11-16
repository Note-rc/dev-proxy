import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* 标题部分 */}
        <div className="bg-gradient-to-r from-[#233895] to-[#4158d0] text-white p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dev Proxy</h1>
              <p className="text-lg opacity-90">
                开发者代理工具 - 帮助文档（以下由AI生成）
              </p>
            </div>
            <button
              onClick={() => {
                window.open(
                  `chrome-extension://${chrome.runtime.id}/config.html`,
                  "_blank"
                );
              }}
              className="px-6 py-3 bg-white text-[#233895] rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 shadow-md"
              title="打开配置中心"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              配置中心
            </button>
          </div>
        </div>

        {/* 功能介绍 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            🎯 功能概览
          </h2>
          <p className="text-gray-700 mb-4">
            Dev Proxy
            是一个强大的Chrome开发者工具扩展，提供了四大核心功能来帮助开发者提高工作效率：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                🚀 代理服务器
              </h3>
              <p className="text-gray-600 text-sm">
                配置系统代理、直接连接或自定义代理服务器
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                📡 路由替换
              </h3>
              <p className="text-gray-600 text-sm">
                将特定前缀的URL请求代理到另一个地址
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                📝 脚本替换
              </h3>
              <p className="text-gray-600 text-sm">
                替换页面中的JavaScript文件内容
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                🔀 JS重定向
              </h3>
              <p className="text-gray-600 text-sm">
                将指定的JS文件请求重定向到其他地址
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                🍪 Cookie管理
              </h3>
              <p className="text-gray-600 text-sm">
                在不同域名之间复制Cookie信息
              </p>
            </div>
          </div>
        </div>

        {/* whistle 推荐 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            💡 推荐配合工具
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Whistle - 跨平台网络调试代理工具
            </h3>
            <p className="text-gray-700 mb-3">
              <a
                href="https://github.com/avwo/whistle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                whistle
              </a>{" "}
              是一款基于 Node.js
              实现的跨平台网络抓包调试工具，功能强大且操作简单。
            </p>
            <div className="bg-white rounded p-4 mb-3">
              <h4 className="font-semibold text-gray-800 mb-2">主要特点：</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>支持 HTTP、HTTPS、WebSocket、TCP 等多种协议</li>
                <li>支持查看和修改请求/响应</li>
                <li>内置 Weinre、Console、Composer 等调试工具</li>
                <li>支持通过配置规则修改请求/响应</li>
                <li>跨平台支持（macOS、Windows、Linux）</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-gray-700">
                <strong>使用建议：</strong>先启动 whistle 代理服务器（默认端口
                8899），然后在本扩展的「代理服务器」配置中填写 whistle
                的地址和端口，即可实现更强大的网络调试功能。
              </p>
            </div>
          </div>
        </div>

        {/* 路由替换 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            📡 路由替换
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              功能说明
            </h3>
            <p className="text-gray-700 mb-2">
              路由替换功能允许你将匹配特定前缀的URL请求自动代理到另一个目标地址。支持多条规则，每条规则可以独立启用或禁用。
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              使用场景
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>将生产环境的API请求代理到本地开发服务器</li>
              <li>将CDN资源请求代理到本地文件</li>
              <li>测试不同环境的接口</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              配置说明
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>源地址前缀：</strong>需要被代理的URL前缀
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>目标地址前缀：</strong>代理的目标地址前缀
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>全局生效：</strong>是否在所有页面生效
              </p>
              <p className="text-sm text-gray-700">
                <strong>特定页面URL：</strong>
                不全局生效时，仅在指定URL的页面生效
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">示例</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <p className="text-green-400 mb-2"># 示例1: 代理API请求到本地</p>
              <p>源地址前缀: https://api.example.com</p>
              <p>目标地址前缀: http://localhost:3000</p>
              <p className="mt-2 text-gray-400"># 实际效果:</p>
              <p className="text-yellow-300">
                https://api.example.com/users → http://localhost:3000/users
              </p>
            </div>
          </div>
        </div>

        {/* 脚本替换 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            📝 脚本替换
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              功能说明
            </h3>
            <p className="text-gray-700 mb-2">
              脚本替换功能可以将页面中加载的JavaScript文件内容替换为你指定的内容。这对于调试和修改第三方脚本非常有用。
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              使用场景
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>修改和调试线上JavaScript代码</li>
              <li>替换第三方库的内容进行测试</li>
              <li>临时修复生产环境的bug</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              配置说明
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>脚本URL：</strong>需要被替换的脚本文件URL
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>替换内容：</strong>新的JavaScript代码内容
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>全局生效：</strong>是否在所有页面生效
              </p>
              <p className="text-sm text-gray-700">
                <strong>特定页面URL：</strong>
                不全局生效时，仅在指定URL的页面生效
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚠️ 注意事项
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-gray-700">
                替换的内容会直接执行，请确保代码的安全性和正确性
              </p>
            </div>
          </div>
        </div>

        {/* JS重定向 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            🔀 JS重定向
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              功能说明
            </h3>
            <p className="text-gray-700 mb-2">
              JS重定向功能可以将指定的JavaScript文件请求重定向到另一个URL地址。支持多条重定向规则，每条规则可以独立启用或禁用。
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              使用场景
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>将线上JS文件重定向到本地开发版本</li>
              <li>替换CDN上的JS文件到备用地址</li>
              <li>使用不同版本的JavaScript库进行测试</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              配置说明
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>代码URL：</strong>
                需要被重定向的JavaScript文件URL（支持精确匹配或模糊匹配）
              </p>
              <p className="text-sm text-gray-700">
                <strong>重定向URL：</strong>重定向的目标JavaScript文件URL
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">示例</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <p className="text-green-400 mb-2">
                # 示例: 重定向jQuery到本地版本
              </p>
              <p>代码URL: https://cdn.example.com/jquery.min.js</p>
              <p>重定向URL: http://localhost:8080/jquery.min.js</p>
            </div>
          </div>
        </div>

        {/* Cookie管理 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            🍪 Cookie管理
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              功能说明
            </h3>
            <p className="text-gray-700 mb-2">
              Cookie管理功能可以将一个域名下的所有Cookie复制到另一个域名，方便在不同环境间同步登录状态和会话信息。
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              使用场景
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>从生产环境复制登录Cookie到测试环境</li>
              <li>在不同域名的开发环境间同步会话</li>
              <li>快速测试不同环境的用户状态</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              配置说明
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>源域名：</strong>Cookie来源的域名（例如：example.com）
              </p>
              <p className="text-sm text-gray-700">
                <strong>目标域名：</strong>
                Cookie要复制到的域名（例如：dev.example.com）
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚠️ 注意事项
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>需要同时打开源域名和目标域名的页面</li>
                <li>某些HttpOnly的Cookie可能无法复制</li>
                <li>请注意Cookie的安全性，不要在不信任的环境中使用</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            ❓ 常见问题
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Q: 代理规则不生效怎么办？
              </h3>
              <p className="text-gray-700 text-sm">
                A: 请检查：1) 规则是否已启用；2) URL前缀是否完全匹配；3)
                如果不是全局生效，当前页面URL是否匹配特定页面URL；4)
                尝试刷新页面重新加载。
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Q: 如何查看扩展的运行状态？
              </h3>
              <p className="text-gray-700 text-sm">
                A:
                打开Chrome开发者工具(F12)，在Console标签中可以看到扩展的日志输出，包括代理规则的匹配情况。
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Q: 可以同时使用多个功能吗？
              </h3>
              <p className="text-gray-700 text-sm">
                A:
                可以！所有功能都是独立的，可以同时启用多个路由替换规则、JS重定向规则等。
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                Q: 配置会保存吗？
              </h3>
              <p className="text-gray-700 text-sm">
                A:
                会的。所有配置都会自动保存在Chrome的本地存储中，下次打开浏览器时会自动恢复。
              </p>
            </div>
          </div>
        </div>

        {/* 快速开始 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            🚀 快速开始
          </h2>

          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                1
              </span>
              <p className="text-gray-700">
                点击浏览器工具栏中的扩展图标打开弹窗
              </p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                2
              </span>
              <p className="text-gray-700">
                选择需要使用的功能标签（路由替换/脚本替换/JS重定向/Cookie）
              </p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                3
              </span>
              <p className="text-gray-700">填写相应的配置信息并点击保存</p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                4
              </span>
              <p className="text-gray-700">刷新目标页面，规则即可生效</p>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="text-center text-gray-500 text-sm mt-8 pb-8">
          <p>Dev Proxy v1.7</p>
          <p className="mt-2">开发者工具 · 提升开发效率</p>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<HelpPage />);
