import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import t, { getLocale, saveLocale, loadSavedLocale, Locale } from "./i18n";
import chromeStore from "./tools/chromeStore";
import { ProxyRule } from "./components/proxyPopup/RouteReplaceTool";
import { RedirectRule } from "./components/proxyPopup/RedirectTool";
import { ScriptRule } from "./components/proxyPopup/ScriptTool";
import { ProxyConfig, ProxyMode } from "./components/proxyPopup/ProxyTool";
import { HeaderRule } from "./components/proxyPopup/HeaderTool";
import { Profile } from "./components/proxyPopup/types";

interface ConfigCardProps {
  title: string;
  icon: string;
  color: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  title,
  icon,
  color,
  description,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div
        className="p-6 cursor-pointer hover:opacity-90 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        }}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{icon}</div>
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color }}>
                {title}
              </h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-gray-100 animate-slideDown">
          {children}
        </div>
      )}
    </div>
  );
};

const RouteConfigPanel: React.FC<{
  rules: ProxyRule[];
  onSave: (rules: ProxyRule[]) => void;
}> = ({ rules, onSave }) => {
  const [localRules, setLocalRules] = useState<ProxyRule[]>(rules);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ sourcePrefix: "", targetPrefix: "" });

  useEffect(() => { setLocalRules(rules); }, [rules]);

  const saveRules = (newRules: ProxyRule[]) => {
    setLocalRules(newRules);
    onSave(newRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourcePrefix || !formData.targetPrefix) return;

    if (editingId) {
      saveRules(localRules.map((r) =>
        r.id === editingId ? { ...r, ...formData, isGlobal: true, specificUrl: undefined } : r
      ));
      setEditingId(null);
    } else {
      saveRules([...localRules, {
        id: Date.now().toString(), ...formData, isGlobal: true, specificUrl: undefined, enabled: true,
      }]);
    }
    setFormData({ sourcePrefix: "", targetPrefix: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {localRules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => saveRules(localRules.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? "bg-blue-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold text-gray-700">{t("config.sourceAddr")}：</span><span className="text-gray-600">{rule.sourcePrefix}</span></div>
                  <div><span className="font-semibold text-gray-700">{t("config.targetAddr")}：</span><span className="text-gray-600">{rule.targetPrefix}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setFormData({ sourcePrefix: rule.sourcePrefix, targetPrefix: rule.targetPrefix }); setEditingId(rule.id); setIsAdding(true); }}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">{t("common.edit")}</button>
                <button onClick={() => saveRules(localRules.filter((r) => r.id !== rule.id))}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">{t("common.delete")}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">{t("config.addRouteRule")}</button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg space-y-4">
          <h4 className="font-bold text-lg text-gray-800">{editingId ? t("common.editRule") : t("common.newRule")}</h4>
          <input value={formData.sourcePrefix} onChange={(e) => setFormData({ ...formData, sourcePrefix: e.target.value })} placeholder={t("config.sourcePrefixPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input value={formData.targetPrefix} onChange={(e) => setFormData({ ...formData, targetPrefix: e.target.value })} placeholder={t("config.targetPrefixPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">{t("common.save")}</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ sourcePrefix: "", targetPrefix: "" }); }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">{t("common.cancel")}</button>
          </div>
        </form>
      )}
    </div>
  );
};

const ScriptConfigPanel: React.FC<{
  rules: ScriptRule[];
  onSave: (rules: ScriptRule[]) => void;
}> = ({ rules, onSave }) => {
  const [localRules, setLocalRules] = useState<ScriptRule[]>(rules);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ scriptUrl: "", replacementContent: "" });

  useEffect(() => { setLocalRules(rules); }, [rules]);

  const saveRules = (newRules: ScriptRule[]) => {
    setLocalRules(newRules);
    onSave(newRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scriptUrl || !formData.replacementContent) return;

    if (editingId) {
      saveRules(localRules.map((r) =>
        r.id === editingId ? { ...r, ...formData, isGlobal: true, specificUrl: undefined } : r
      ));
      setEditingId(null);
    } else {
      saveRules([...localRules, {
        id: Date.now().toString(), ...formData, isGlobal: true, specificUrl: undefined, enabled: true,
      }]);
    }
    setFormData({ scriptUrl: "", replacementContent: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {localRules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => saveRules(localRules.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? "bg-green-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold text-gray-700">{t("config.scriptUrl")}：</span><span className="text-gray-600">{rule.scriptUrl}</span></div>
                  <div><span className="font-semibold text-gray-700">{t("config.replacement")}：</span><span className="text-gray-600 font-mono text-xs">{rule.replacementContent.substring(0, 80)}{rule.replacementContent.length > 80 ? "..." : ""}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setFormData({ scriptUrl: rule.scriptUrl, replacementContent: rule.replacementContent }); setEditingId(rule.id); setIsAdding(true); }}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600">{t("common.edit")}</button>
                <button onClick={() => saveRules(localRules.filter((r) => r.id !== rule.id))}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">{t("common.delete")}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">{t("config.addScriptRule")}</button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg space-y-4">
          <h4 className="font-bold text-lg text-gray-800">{editingId ? t("common.editRule") : t("common.newRule")}</h4>
          <input value={formData.scriptUrl} onChange={(e) => setFormData({ ...formData, scriptUrl: e.target.value })} placeholder={t("config.scriptUrlInputPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" required />
          <textarea value={formData.replacementContent} onChange={(e) => setFormData({ ...formData, replacementContent: e.target.value })} placeholder={t("config.replacementCodePlaceholder")} rows={10} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm" required />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">{t("common.save")}</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ scriptUrl: "", replacementContent: "" }); }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">{t("common.cancel")}</button>
          </div>
        </form>
      )}
    </div>
  );
};

const RedirectConfigPanel: React.FC<{
  rules: RedirectRule[];
  onSave: (rules: RedirectRule[]) => void;
}> = ({ rules, onSave }) => {
  const [localRules, setLocalRules] = useState<RedirectRule[]>(rules);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ codeUrl: "", redirectUrl: "" });

  useEffect(() => { setLocalRules(rules); }, [rules]);

  const saveRules = (newRules: RedirectRule[]) => {
    setLocalRules(newRules);
    onSave(newRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codeUrl || !formData.redirectUrl) return;
    saveRules([...localRules, { id: Date.now().toString(), ...formData, enabled: true }]);
    setFormData({ codeUrl: "", redirectUrl: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {localRules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? "border-purple-200 bg-purple-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => saveRules(localRules.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? "bg-purple-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold text-gray-700">{t("config.sourceJs")}：</span><span className="text-gray-600">{rule.codeUrl}</span></div>
                  <div><span className="font-semibold text-gray-700">{t("config.redirectTo")}：</span><span className="text-gray-600">{rule.redirectUrl}</span></div>
                </div>
              </div>
              <button onClick={() => saveRules(localRules.filter((r) => r.id !== rule.id))}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">{t("common.delete")}</button>
            </div>
          </div>
        ))}
      </div>
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium">{t("config.addRedirectRule")}</button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg space-y-4">
          <h4 className="font-bold text-lg text-gray-800">{t("config.newRedirectRule")}</h4>
          <input value={formData.codeUrl} onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })} placeholder={t("config.redirectSourcePlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
          <input value={formData.redirectUrl} onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })} placeholder={t("config.redirectTargetPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" required />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">{t("common.save")}</button>
            <button type="button" onClick={() => { setIsAdding(false); setFormData({ codeUrl: "", redirectUrl: "" }); }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">{t("common.cancel")}</button>
          </div>
        </form>
      )}
    </div>
  );
};

const HeaderConfigPanel: React.FC<{
  rules: HeaderRule[];
  onSave: (rules: HeaderRule[]) => void;
}> = ({ rules, onSave }) => {
  const [localRules, setLocalRules] = useState<HeaderRule[]>(rules);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ headerName: "", headerValue: "" });

  useEffect(() => { setLocalRules(rules); }, [rules]);

  const saveRules = (newRules: HeaderRule[]) => {
    setLocalRules(newRules);
    onSave(newRules);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.headerName || !formData.headerValue) return;

    if (editingId) {
      saveRules(localRules.map((r) => r.id === editingId ? { ...r, ...formData } : r));
      setEditingId(null);
    } else {
      saveRules([...localRules, { id: Date.now().toString(), ...formData, enabled: true }]);
    }
    setFormData({ headerName: "", headerValue: "" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {localRules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => saveRules(localRules.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? "bg-orange-500" : "bg-gray-300"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? "translate-x-7" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <div><span className="font-semibold text-gray-700">{rule.headerName}:</span> <span className="text-gray-600">{rule.headerValue}</span></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setFormData({ headerName: rule.headerName, headerValue: rule.headerValue }); setEditingId(rule.id); setIsAdding(true); }}
                  className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600">{t("common.edit")}</button>
                <button onClick={() => saveRules(localRules.filter((r) => r.id !== rule.id))}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">{t("common.delete")}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium">{t("config.addHeaderRule")}</button>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg space-y-4">
          <h4 className="font-bold text-lg text-gray-800">{editingId ? t("common.editRule") : t("common.newRule")}</h4>
          <input value={formData.headerName} onChange={(e) => setFormData({ ...formData, headerName: e.target.value })} placeholder={t("config.headerNamePlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
          <input value={formData.headerValue} onChange={(e) => setFormData({ ...formData, headerValue: e.target.value })} placeholder={t("config.headerValuePlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" required />
          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">{t("common.save")}</button>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ headerName: "", headerValue: "" }); }} className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">{t("common.cancel")}</button>
          </div>
        </form>
      )}
    </div>
  );
};

const ProxyServerConfigPanel: React.FC<{
  config: ProxyConfig | null;
  onSave: (config: ProxyConfig) => void;
}> = ({ config: initialConfig, onSave }) => {
  const [config, setConfig] = useState<ProxyConfig>(initialConfig || { mode: ProxyMode.DIRECT, rules: [] });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialConfig) setConfig(initialConfig);
  }, [initialConfig]);

  const getModeLabel = (mode: ProxyMode): string => {
    switch (mode) {
      case ProxyMode.SYSTEM: return t("proxy.system");
      case ProxyMode.DIRECT: return t("proxy.direct");
      case ProxyMode.CUSTOM: return t("proxy.custom");
      default: return "";
    }
  };

  const handleModeChange = (mode: ProxyMode) => {
    const newConfig = { ...config, mode };
    setConfig(newConfig);
    onSave(newConfig);
    setMessage(t("proxy.modeUpdated"));
    setTimeout(() => setMessage(""), 1000);
  };

  const handleServerSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    setMessage(t("proxy.serverSaved"));
    setTimeout(() => setMessage(""), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3 text-gray-700">{t("config.proxyMode")}</h4>
        <div className="grid grid-cols-3 gap-3">
          {Object.values(ProxyMode).map((mode) => (
            <button key={mode} onClick={() => handleModeChange(mode)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${config.mode === mode ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"}`}>
              <div className="font-medium text-sm">{getModeLabel(mode)}</div>
            </button>
          ))}
        </div>
      </div>

      {config.mode === ProxyMode.CUSTOM && (
        <form onSubmit={handleServerSave} className="space-y-4 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold text-gray-700">{t("config.proxyServerSettings")}</h4>
          <div className="text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded">
            {t("config.whistleTip")}{" "}
            <a href="https://github.com/avwo/whistle" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline hover:text-indigo-700">whistle</a>{" "}
            {t("config.whistleDesc")}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">{t("config.serverAddr")}</label>
            <input type="text" value={config.server?.host || ""} onChange={(e) => setConfig({ ...config, server: { host: e.target.value, port: config.server?.port || 8080 } })}
              placeholder={t("config.serverAddrPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">{t("config.port")}</label>
            <input type="number" value={config.server?.port || 8080} onChange={(e) => setConfig({ ...config, server: { host: config.server?.host || "", port: parseInt(e.target.value) || 8080 } })}
              placeholder={t("config.portPlaceholder")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">{t("config.saveServerConfig")}</button>
        </form>
      )}

      {message && <div className="text-center text-sm font-medium text-green-600">{message}</div>}
    </div>
  );
};

// 场景选择器
const SceneSelector: React.FC<{
  profiles: Profile[];
  activeId: string;
  onSwitch: (id: string) => void;
}> = ({ profiles, activeId, onSwitch }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {profiles.map((p) => (
        <button
          key={p.id}
          onClick={() => onSwitch(p.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            p.id === activeId
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:shadow-sm"
          }`}
        >
          {p.name}
          {p.enabled && (
            <span className={`ml-2 text-xs ${p.id === activeId ? "text-indigo-200" : "text-green-500"}`}>
              ({t("scene.active")})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

const ConfigPage: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [locale, setLocaleState] = useState<Locale>(getLocale());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedLocale().then((saved) => {
      setLocaleState(saved);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    loadProfiles();
  }, [ready]);

  const loadProfiles = async () => {
    const savedProfiles = await chromeStore.get("profiles");
    const savedActiveId = await chromeStore.get("activeProfileId");

    if (savedProfiles && Array.isArray(savedProfiles) && savedProfiles.length > 0) {
      setProfiles(savedProfiles);
      const validId = savedProfiles.find((p: Profile) => p.id === savedActiveId)
        ? savedActiveId
        : savedProfiles[0].id;
      setActiveProfileId(validId);
    } else {
      const defaultProfile: Profile = {
        id: "1",
        name: `${t("scene.defaultName")} 1`,
        enabled: true,
        headerConfig: [],
        proxyConfig: [],
        scriptConfig: [],
        codeConfig: [],
        proxyServerConfig: null,
      };
      setProfiles([defaultProfile]);
      setActiveProfileId(defaultProfile.id);
      await chromeStore.set({
        profiles: [defaultProfile],
        activeProfileId: defaultProfile.id,
      });
    }
  };

  const saveProfiles = async (newProfiles: Profile[], newActiveId?: string) => {
    const resolvedActiveId = newActiveId || activeProfileId;
    setProfiles(newProfiles);
    if (newActiveId) setActiveProfileId(newActiveId);

    const enabledProfile = newProfiles.find((p) => p.enabled);
    await chromeStore.set({
      profiles: newProfiles,
      activeProfileId: resolvedActiveId,
      headerConfig: enabledProfile?.headerConfig || [],
      scriptConfig: enabledProfile?.scriptConfig || [],
      codeConfig: enabledProfile?.codeConfig || [],
      proxyServerConfig: enabledProfile?.proxyServerConfig || null,
    });
  };

  const handleSceneSwitch = (id: string) => {
    const newProfiles = profiles.map((p) => ({ ...p, enabled: p.id === id }));
    saveProfiles(newProfiles, id);
  };

  const updateCurrentProfile = (updater: (p: Profile) => Profile) => {
    const newProfiles = profiles.map((p) =>
      p.id === activeProfileId ? updater(p) : p
    );
    saveProfiles(newProfiles);
  };

  const handleLocaleToggle = async () => {
    const next: Locale = locale === "en" ? "zh" : "en";
    await saveLocale(next);
    setLocaleState(next);
  };

  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  useEffect(() => {
    if (currentProfile && currentProfile.id !== activeProfileId) {
      setActiveProfileId(currentProfile.id);
    }
  }, [currentProfile, activeProfileId]);

  if (!ready || profiles.length === 0) return null;
  if (!currentProfile) return null;

  const configs = [
    {
      id: "header",
      title: t("config.headerModifyTitle"),
      icon: "📋",
      color: "#f97316",
      description: t("config.headerDesc"),
      component: (
        <HeaderConfigPanel
          key={activeProfileId}
          rules={currentProfile.headerConfig}
          onSave={(rules) => updateCurrentProfile((p) => ({ ...p, headerConfig: rules }))}
        />
      ),
    },
    {
      id: "proxy",
      title: t("config.routeReplaceTitle"),
      icon: "🌐",
      color: "#3b82f6",
      description: t("config.routeDesc"),
      component: (
        <RouteConfigPanel
          key={activeProfileId}
          rules={currentProfile.proxyConfig}
          onSave={(rules) => updateCurrentProfile((p) => ({ ...p, proxyConfig: rules }))}
        />
      ),
    },
    {
      id: "script",
      title: t("config.scriptReplaceTitle"),
      icon: "📝",
      color: "#10b981",
      description: t("config.scriptDesc"),
      component: (
        <ScriptConfigPanel
          key={activeProfileId}
          rules={currentProfile.scriptConfig}
          onSave={(rules) => updateCurrentProfile((p) => ({ ...p, scriptConfig: rules }))}
        />
      ),
    },
    {
      id: "redirect",
      title: t("config.jsRedirectTitle"),
      icon: "🔀",
      color: "#8b5cf6",
      description: t("config.redirectDesc"),
      component: (
        <RedirectConfigPanel
          key={activeProfileId}
          rules={currentProfile.codeConfig}
          onSave={(rules) => updateCurrentProfile((p) => ({ ...p, codeConfig: rules }))}
        />
      ),
    },
    {
      id: "proxyServer",
      title: t("config.proxyServerTitle"),
      icon: "🚀",
      color: "#6366f1",
      description: t("config.proxyServerDesc"),
      component: (
        <ProxyServerConfigPanel
          key={activeProfileId}
          config={currentProfile.proxyServerConfig}
          onSave={(config) => updateCurrentProfile((p) => ({ ...p, proxyServerConfig: config }))}
        />
      ),
    },
  ];

  return (
    <div key={locale} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t("config.title")}
              </h1>
              <p className="text-gray-500 mt-1">{t("config.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleLocaleToggle}
                className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {locale === "en" ? "中文" : "English"}
              </button>
              <button onClick={() => { window.open(`chrome-extension://${chrome.runtime.id}/help.html`, "_blank"); }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">
                {t("config.helpDoc")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* 场景选择器 */}
        <div className="mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="text-sm font-medium text-gray-500 mb-3">{t("config.sceneSelect")}</div>
          <SceneSelector profiles={profiles} activeId={activeProfileId} onSwitch={handleSceneSwitch} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {configs.map((config) => (
            <ConfigCard
              key={config.id}
              title={config.title}
              icon={config.icon}
              color={config.color}
              description={config.description}
              isExpanded={expandedCard === config.id}
              onToggle={() => setExpandedCard(expandedCard === config.id ? null : config.id)}
            >
              {config.component}
            </ConfigCard>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-sm text-gray-600">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t("config.autoSaveHint")}
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<ConfigPage />);
