// src/content.ts

// 只导入ProxyContent，不再使用ScriptProxy
import ProxyContent from "./tools/ProxyContent";

// 启动iFrame代理功能
ProxyContent();

function isContextValid() {
  try {
    return !!(chrome?.runtime && chrome.runtime.id);
  } catch {
    // 扩展被重载/禁用后，访问 chrome.runtime 可能直接抛错：Extension context invalidated
    return false;
  }
}

// 报告当前页面的URL
function reportPageUrl() {
  if (!isContextValid()) return;
  try {
    chrome.runtime.sendMessage({
      action: "reportPageUrl",
      url: window.location.href,
    });
  } catch {
    // Extension context invalidated, stop polling
    clearInterval(urlCheckInterval);
  }
}

// 初始报告
reportPageUrl();

// 监听URL变化（针对SPA应用）
let lastUrl = window.location.href;

// 定期检查URL变化
const urlCheckInterval = setInterval(() => {
  if (!isContextValid()) {
    clearInterval(urlCheckInterval);
    return;
  }
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
