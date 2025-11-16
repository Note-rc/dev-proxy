// src/content.ts

// 只导入ProxyContent，不再使用ScriptProxy
import ProxyContent from "./tools/ProxyContent";

// 启动iFrame代理功能
ProxyContent();

// 报告当前页面的URL
function reportPageUrl() {
  chrome.runtime.sendMessage({
    action: "reportPageUrl",
    url: window.location.href,
  });
}

// 初始报告
reportPageUrl();

// 监听URL变化（针对SPA应用）
let lastUrl = window.location.href;

// 定期检查URL变化
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    reportPageUrl();
  }
}, 1000);

// 处理history API的变化
const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  reportPageUrl();
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  originalReplaceState.apply(this, args);
  reportPageUrl();
};

// 监听popstate事件（浏览器前进/后退）
window.addEventListener("popstate", () => {
  reportPageUrl();
});
