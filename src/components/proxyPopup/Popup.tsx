import React, { useState, useEffect } from "react";
import t from "../../i18n";
import chromeStore from "../../tools/chromeStore";
import RouteReplaceTool, { ProxyRule } from "./RouteReplaceTool";
import ScriptTool, { ScriptRule } from "./ScriptTool";
import RedirectTool, { RedirectRule } from "./RedirectTool";
import HeaderTool, { HeaderRule } from "./HeaderTool";
import ProxyTool, { ProxyConfig } from "./ProxyTool";

const Popup = () => {
  const [activeTab, setActiveTab] = useState<
    "proxy" | "route" | "script" | "redirect" | "header"
  >("header");
  const [proxyServerConfig, setProxyServerConfig] = useState<ProxyConfig | null>(null);
  const [proxyConfig, setProxyConfig] = useState<ProxyRule[]>([]);
  const [scriptConfig, setScriptConfig] = useState<ScriptRule[]>([]);
  const [codeConfig, setCodeConfig] = useState<RedirectRule[]>([]);
  const [headerConfig, setHeaderConfig] = useState<HeaderRule[]>([]);

  useEffect(() => {
    // 加载代理服务器配置
    chromeStore.get("proxyServerConfig").then((data) => {
      console.log("proxyServerConfig", data);
      if (data) {
        setProxyServerConfig(data);
      }
    });

    // 加载代理配置
    chromeStore.get("proxyConfig").then((data) => {
      console.log("proxyConfig", data);
      if (data) {
        // 兼容旧数据：如果是单个对象，转换为数组
        if (!Array.isArray(data)) {
          const legacyRule: ProxyRule = {
            id: Date.now().toString(),
            sourcePrefix: data.sourcePrefix,
            targetPrefix: data.targetPrefix,
            isGlobal: data.isGlobal,
            specificUrl: data.specificUrl,
            enabled: data.enabled ?? true,
          };
          setProxyConfig([legacyRule]);
        } else {
          setProxyConfig(data);
        }
      }
    });

    // 加载脚本配置
    chromeStore.get("scriptConfig").then((data) => {
      console.log("scriptConfig", data);
      if (data) {
        // 兼容旧数据：如果是单个对象，转换为数组
        if (!Array.isArray(data)) {
          const legacyRule: ScriptRule = {
            id: Date.now().toString(),
            scriptUrl: data.scriptUrl,
            replacementContent: data.replacementContent,
            isGlobal: data.isGlobal,
            specificUrl: data.specificUrl,
            enabled: data.enabled ?? true,
          };
          setScriptConfig([legacyRule]);
        } else {
          setScriptConfig(data);
        }
      }
    });

    // 加载代码配置
    chromeStore.get("codeConfig").then((data) => {
      console.log("codeConfig", data);
      if (data) {
        // 兼容旧数据：如果是单个对象，转换为数组
        if (!Array.isArray(data)) {
          const legacyRule: RedirectRule = {
            id: Date.now().toString(),
            codeUrl: data.codeUrl,
            redirectUrl: data.redirectUrl,
            enabled: data.enabled ?? true,
          };
          setCodeConfig([legacyRule]);
        } else {
          setCodeConfig(data);
        }
      }
    });

    // 加载请求头配置
    chromeStore.get("headerConfig").then((data) => {
      console.log("headerConfig", data);
      if (data && Array.isArray(data)) {
        setHeaderConfig(data);
      }
    });
  }, []);

  const handleProxyServerSubmit = (data: ProxyConfig) => {
    console.log(data);
    chromeStore.set("proxyServerConfig", data);
    setProxyServerConfig(data);
  };

  const handleProxySubmit = (data: ProxyRule[]) => {
    console.log(data);
    chromeStore.set("proxyConfig", data);
    setProxyConfig(data);
  };

  const handleScriptSubmit = (data: ScriptRule[]) => {
    console.log(data);
    chromeStore.set("scriptConfig", data);
    setScriptConfig(data);
  };

  const handleRedirectSubmit = (data: RedirectRule[]) => {
    console.log(data);
    chromeStore.set("codeConfig", data);
    setCodeConfig(data);
  };

  const handleHeaderSubmit = (data: HeaderRule[]) => {
    console.log(data);
    chromeStore.set("headerConfig", data);
    setHeaderConfig(data);
  };

  return (
    <div className="w-[500px] bg-white font-[PingFang_SC] p-4 dev-tools-popup">
      <div className="h-10 flex items-center justify-between text-[#233895] text-xl">
        <span>Proxy</span>
        <button
          onClick={() => {
            window.open(`chrome-extension://${chrome.runtime.id}/config.html`, '_blank');
          }}
          className="text-xs px-3 py-1 bg-[#233895] text-white rounded hover:bg-[#1a2a70] transition-colors flex items-center gap-1"
          title={t("popup.openConfigCenter")}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {t("popup.configCenter")}
        </button>
      </div>
      <div className="flex items-center justify-between mb-4 border-b border-[#eee]">
        <div
          className={`px-3 py-2 cursor-pointer text-xs ${
            activeTab === "header"
              ? "text-[#233895] border-b-2 border-[#233895]"
              : "text-[#666]"
          }`}
          onClick={() => setActiveTab("header")}
        >
          Header
        </div>
        <div
          className={`px-3 py-2 cursor-pointer text-xs ${
            activeTab === "route"
              ? "text-[#233895] border-b-2 border-[#233895]"
              : "text-[#666]"
          }`}
          onClick={() => setActiveTab("route")}
        >
          Route
        </div>
        <div
          className={`px-3 py-2 cursor-pointer text-xs ${
            activeTab === "script"
              ? "text-[#233895] border-b-2 border-[#233895]"
              : "text-[#666]"
          }`}
          onClick={() => setActiveTab("script")}
        >
          Script
        </div>
        <div
          className={`px-3 py-2 cursor-pointer text-xs ${
            activeTab === "redirect"
              ? "text-[#233895] border-b-2 border-[#233895]"
              : "text-[#666]"
          }`}
          onClick={() => setActiveTab("redirect")}
        >
          Redirect
        </div>
        <div
          className={`px-3 py-2 cursor-pointer text-xs ${
            activeTab === "proxy"
              ? "text-[#233895] border-b-2 border-[#233895]"
              : "text-[#666]"
          }`}
          onClick={() => setActiveTab("proxy")}
        >
          Proxy
        </div>
      </div>

      {activeTab === "header" && (
        <HeaderTool
          onSubmit={handleHeaderSubmit}
          initialValue={headerConfig}
        />
      )}

      {activeTab === "route" && (
        <RouteReplaceTool onSubmit={handleProxySubmit} initialValue={proxyConfig} />
      )}

      {activeTab === "script" && (
        <ScriptTool onSubmit={handleScriptSubmit} initialValue={scriptConfig} />
      )}

      {activeTab === "redirect" && (
        <RedirectTool
          onSubmit={handleRedirectSubmit}
          initialValue={codeConfig}
        />
      )}

      {activeTab === "proxy" && (
        <ProxyTool onSubmit={handleProxyServerSubmit} initialValue={proxyServerConfig} />
      )}
    </div>
  );
};

export default Popup;
