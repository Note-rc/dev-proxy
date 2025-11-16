// src/background.ts
import chromeStore from "./tools/chromeStore";
import {
  ProxyMode,
  ProxyConfig,
} from "./components/proxyPopup/ProxyTool";

console.log("Background script running");

interface RedirectRule {
  id: string;
  codeUrl: string;
  redirectUrl: string;
  enabled: boolean;
}

interface ScriptRule {
  id: string;
  scriptUrl: string;
  replacementContent: string;
  isGlobal: boolean;
  specificUrl?: string;
  enabled: boolean;
}

// 定义一个变量存储脚本配置（数组形式，支持多个规则）
let scriptConfig: ScriptRule[] = [];

// 定义一个变量存储重定向配置（数组形式，支持多个规则）
let redirectConfig: RedirectRule[] = [];

// 定义一个变量存储代理配置
let proxyConfig: ProxyConfig | null = null;

// 脚本替换规则起始ID
const SCRIPT_REDIRECT_BASE_ID = 1000000;
// URL重定向规则起始ID
const URL_REDIRECT_BASE_ID = 2000000;

// 设置代理配置
async function setProxyConfig(config: ProxyConfig) {
  try {
    console.log("🔧 ~ 设置代理配置:", config);

    if (config.mode === ProxyMode.DIRECT) {
      // 直接连接模式
      await chrome.proxy.settings.set({
        value: {
          mode: "direct",
        },
        scope: "regular",
      });
      console.log("✅ ~ 代理已设置为: 直接连接");
    } else if (config.mode === ProxyMode.SYSTEM) {
      // 系统代理模式
      await chrome.proxy.settings.set({
        value: {
          mode: "system",
        },
        scope: "regular",
      });
      console.log("✅ ~ 代理已设置为: 系统代理");
    } else if (config.mode === ProxyMode.CUSTOM) {
      // 自定义代理模式
      if (!config.server || !config.server.host || !config.server.port) {
        console.warn("⚠️ ~ 自定义模式下未配置代理服务器，使用直接连接");
        await chrome.proxy.settings.set({
          value: {
            mode: "direct",
          },
          scope: "regular",
        });
        return;
      }

      const { host, port } = config.server;

      // 构建代理服务器配置
      const proxyServer = `${host}:${port}`;

      // 使用 HTTP 代理，HTTP、HTTPS、SOCKS 等所有协议都走这个代理
      const proxyRules: chrome.proxy.ProxyRules = {
        proxyForHttp: {
          scheme: "http",
          host: host,
          port: port,
        },
        proxyForHttps: {
          scheme: "http",
          host: host,
          port: port,
        },
        proxyForFtp: {
          scheme: "http",
          host: host,
          port: port,
        },
        fallbackProxy: {
          scheme: "http",
          host: host,
          port: port,
        },
      };

      await chrome.proxy.settings.set({
        value: {
          mode: "fixed_servers",
          rules: proxyRules,
        },
        scope: "regular",
      });

      console.log(`✅ ~ 代理已设置为: ${proxyServer}`);
    }
  } catch (error) {
    console.error("❌ ~ 设置代理失败:", error);
  }
}

// 初始化配置
const initConfig = async () => {
  const scriptData = await chromeStore.get("scriptConfig");
  const codeConfig = await chromeStore.get("codeConfig");
  const proxyData = await chromeStore.get("proxyServerConfig");

  // 兼容旧数据：如果是单个对象，转换为数组
  if (scriptData) {
    if (Array.isArray(scriptData)) {
      scriptConfig = scriptData;
    } else {
      // 旧格式转换为新格式
      scriptConfig = [
        {
          id: Date.now().toString(),
          scriptUrl: scriptData.scriptUrl,
          replacementContent: scriptData.replacementContent,
          isGlobal: scriptData.isGlobal ?? true,
          specificUrl: scriptData.specificUrl,
          enabled: scriptData.enabled ?? true,
        },
      ];
    }
  } else {
    scriptConfig = [];
  }

  // 兼容旧数据：如果是单个对象，转换为数组
  if (codeConfig) {
    if (Array.isArray(codeConfig)) {
      redirectConfig = codeConfig;
    } else {
      // 旧格式转换为新格式
      redirectConfig = [
        {
          id: Date.now().toString(),
          codeUrl: codeConfig.codeUrl,
          redirectUrl: codeConfig.redirectUrl,
          enabled: codeConfig.enabled ?? true,
        },
      ];
    }
  } else {
    redirectConfig = [];
  }

  // 初始化代理配置
  if (proxyData) {
    proxyConfig = proxyData as ProxyConfig;
    await setProxyConfig(proxyConfig);
  } else {
    // 默认使用直接连接
    proxyConfig = {
      mode: ProxyMode.DIRECT,
      rules: [],
    };
  }

  console.log("🚀 ~ 初始化脚本替换配置:", scriptConfig);
  console.log("🚀 ~ 初始化重定向配置:", redirectConfig);
  console.log("🚀 ~ 初始化代理配置:", proxyConfig);
  updateRedirectRules();
};

async function getAllDynamicRuleIds() {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  return rules.map((rule) => rule.id);
}

async function clearAllDynamicRules() {
  const allRuleIds = await getAllDynamicRuleIds();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: allRuleIds,
  });
}

// 更新重定向规则
async function updateRedirectRules() {
  try {
    console.log(
      "🚀 ~开始 更新重定向规则 - scriptConfig:",
      scriptConfig,
      "redirectConfig:",
      redirectConfig
    );
    // 首先移除所有现有规则
    await clearAllDynamicRules();

    const rulesToAdd: chrome.declarativeNetRequest.Rule[] = [];

    // 如果脚本替换功能启用，添加所有启用的脚本替换规则
    if (scriptConfig && Array.isArray(scriptConfig)) {
      scriptConfig.forEach((rule, index) => {
        if (rule.enabled && rule.scriptUrl && rule.replacementContent) {
          const ruleId = SCRIPT_REDIRECT_BASE_ID + index;

          const scriptRule = {
            id: ruleId,
            priority: 2, // 更高优先级，确保脚本替换优先于URL重定向
            action: {
              type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
              redirect: {
                // 使用数据URL替换原始脚本
                url: `data:text/javascript;charset=utf-8,${encodeURIComponent(
                  rule.replacementContent || "console.log('脚本已被替换');"
                )}`,
              },
            },
            condition: {
              urlFilter: rule.scriptUrl,
              resourceTypes: [
                "script" as chrome.declarativeNetRequest.ResourceType,
              ],
            },
          };
          rulesToAdd.push(scriptRule);
          console.log(`🚀 ~ 添加脚本替换规则 [${index}]:`, scriptRule);
        }
      });
    }

    // 如果URL重定向功能启用，添加所有启用的URL重定向规则
    if (redirectConfig && Array.isArray(redirectConfig)) {
      redirectConfig.forEach((rule, index) => {
        if (rule.enabled && rule.codeUrl && rule.redirectUrl) {
          const ruleId = URL_REDIRECT_BASE_ID + index;

          const urlRule = {
            id: ruleId,
            priority: 1, // 较低优先级
            action: {
              type: "redirect" as chrome.declarativeNetRequest.RuleActionType,
              redirect: {
                url: rule.redirectUrl,
              },
            },
            condition: {
              urlFilter: rule.codeUrl,
              resourceTypes: [
                "script" as chrome.declarativeNetRequest.ResourceType,
              ],
            },
          };
          rulesToAdd.push(urlRule);
          console.log(`🚀 ~ 添加URL重定向规则 [${index}]:`, urlRule);
        }
      });
    }

    // 批量添加规则
    if (rulesToAdd.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rulesToAdd,
      });
      console.log(
        "🚀 ~ 所有重定向规则已更新，共添加",
        rulesToAdd.length,
        "条规则"
      );
    } else {
      console.log("🚀 ~ 没有启用的规则需要添加");
    }
  } catch (error) {
    console.error("更新重定向规则失败:", error);
  }
}

// 监听存储变化
chrome.storage.onChanged.addListener((changes, area) => {
  console.log("🚀 ~ 配置监听:", changes["dev-proxy"]?.newValue, area);

  if (area === "local" && changes["dev-proxy"]?.newValue) {
    const newValue = changes["dev-proxy"].newValue;
    let shouldUpdate = false;

    // 监听脚本配置变化
    if (newValue.scriptConfig !== undefined) {
      const scriptData = newValue.scriptConfig;
      // 兼容旧数据：如果是单个对象，转换为数组
      if (Array.isArray(scriptData)) {
        scriptConfig = scriptData;
      } else if (scriptData && typeof scriptData === "object") {
        scriptConfig = [
          {
            id: Date.now().toString(),
            scriptUrl: scriptData.scriptUrl,
            replacementContent: scriptData.replacementContent,
            isGlobal: scriptData.isGlobal ?? true,
            specificUrl: scriptData.specificUrl,
            enabled: scriptData.enabled ?? true,
          },
        ];
      } else {
        scriptConfig = [];
      }
      console.log("🚀 ~ 脚本配置已更新:", scriptConfig);
      shouldUpdate = true;
    }

    // 监听重定向配置变化
    if (newValue.codeConfig !== undefined) {
      const codeConfig = newValue.codeConfig;
      // 兼容旧数据：如果是单个对象，转换为数组
      if (Array.isArray(codeConfig)) {
        redirectConfig = codeConfig;
      } else if (codeConfig && typeof codeConfig === "object") {
        redirectConfig = [
          {
            id: Date.now().toString(),
            codeUrl: codeConfig.codeUrl,
            redirectUrl: codeConfig.redirectUrl,
            enabled: codeConfig.enabled ?? true,
          },
        ];
      } else {
        redirectConfig = [];
      }
      console.log("🚀 ~ 重定向配置已更新:", redirectConfig);
      shouldUpdate = true;
    }

    // 监听代理配置变化
    if (newValue.proxyServerConfig !== undefined) {
      proxyConfig = newValue.proxyServerConfig as ProxyConfig;
      console.log("🚀 ~ 代理配置已更新:", proxyConfig);
      setProxyConfig(proxyConfig);
    }

    // 如果任一配置发生变化，更新规则
    if (shouldUpdate) {
      updateRedirectRules();
    }
  }
});

// 初始化配置
initConfig();

// 监听来自popup或content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getScriptConfig") {
    sendResponse(scriptConfig);
  } else if (message.action === "getRedirectConfig") {
    sendResponse(redirectConfig);
  } else if (message.action === "getProxyConfig") {
    sendResponse(proxyConfig);
  } else if (message.action === "reportPageUrl" && sender.tab?.id) {
    // 保存tab的URL
    const tabId = sender.tab.id;
    const pageUrl = message.url;
    console.log(`🚀 ~ Tab ${tabId} 报告URL: ${pageUrl}`);
    updateRedirectRules();
  }
});
