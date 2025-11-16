import chromeStore from "./chromeStore";

export interface ProxyRule {
  id: string;
  sourcePrefix: string;
  targetPrefix: string;
  specificUrl?: string;
  enabled: boolean;
}

// 添加路由替换函数
const replaceIframeSrc = (proxyRules: ProxyRule[]) => {
  // console.log("🚀 ~ proxy extension config:", proxyRules);
  if (!proxyRules || proxyRules.length === 0) return null;

  // 获取当前页面URL
  const currentUrl = window.location.href;

  // 获取所有启用的且适用于当前页面的规则
  const applicableRules = proxyRules.filter((rule) => {
    if (!rule.enabled) return false;

    // 检查当前页面URL是否匹配
    if (rule.specificUrl) {
      return currentUrl.includes(rule.specificUrl);
    }

    return true; // 没有指定URL的规则总是适用
  });

  if (applicableRules.length === 0) return null;

  // 处理单个iframe的src替换
  const processIframe = (iframe: HTMLIFrameElement) => {
    let src = iframe.src;
    // console.log("🚀 ~ proxy extension  iframe~ src:", src);

    // 按顺序应用所有适用的规则
    for (const rule of applicableRules) {
      if (src.startsWith(rule.sourcePrefix)) {
        src = src.replace(rule.sourcePrefix, rule.targetPrefix);
        iframe.src = src;
        break; // 找到第一个匹配的规则后停止
      }
    }
  };

  // 创建 MutationObserver 实例监听DOM变化
  const domObserver = new MutationObserver((mutations) => {
    Array.from(document.getElementsByTagName("iframe")).forEach(processIframe);
  });

  // 创建另一个 MutationObserver 实例专门监听iframe的src属性变化
  const attrObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "src" &&
        mutation.target instanceof HTMLIFrameElement
      ) {
        processIframe(mutation.target);
      }
    });
  });

  // 观察整个文档的DOM变化，包括子树
  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // 处理现有的 iframes 并为每个iframe添加属性监听
  Array.from(document.getElementsByTagName("iframe")).forEach((iframe) => {
    processIframe(iframe);
    // 监听每个iframe的src属性变化
    attrObserver.observe(iframe, {
      attributes: true,
      attributeFilter: ["src"],
    });
  });

  // 定期检查页面上的iframe，确保新添加的iframe也被监听
  const intervalId = setInterval(() => {
    Array.from(document.getElementsByTagName("iframe")).forEach((iframe) => {
      // 检查这个iframe是否已经被监听
      attrObserver.observe(iframe, {
        attributes: true,
        attributeFilter: ["src"],
      });
      processIframe(iframe);
    });
  }, 2000);

  const cleanup = () => {
    domObserver.disconnect();
    attrObserver.disconnect();
    clearInterval(intervalId);
  };

  return cleanup;
};

const ProxyContent = () => {
  let currentObserverCleanup: (() => void) | null = null;

  // 处理配置变化
  const handleConfigChange = (config: any) => {
    // 清理之前的观察者
    if (currentObserverCleanup) {
      currentObserverCleanup();
    }

    if (config) {
      // 兼容旧数据：如果是单个对象，转换为数组
      let rules: ProxyRule[];
      if (!Array.isArray(config)) {
        rules = [
          {
            id: Date.now().toString(),
            sourcePrefix: config.sourcePrefix,
            targetPrefix: config.targetPrefix,
            specificUrl: config.specificUrl,
            enabled: config.enabled ?? true,
          },
        ];
      } else {
        rules = config;
      }

      currentObserverCleanup = replaceIframeSrc(rules);
    }
  };

  // 在 DOM 加载完成后初始化
  const initializeProxy = () => {
    chromeStore.get("proxyConfig").then((config) => {
      console.log("🚀 ~ proxy extension  ~ initialize :", config);
      handleConfigChange(config);
    });
  };

  // 监听 DOM 加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProxy);
  } else {
    initializeProxy();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.proxyConfig) {
      handleConfigChange(changes.proxyConfig.newValue);
    }
  });
};

export default ProxyContent;
