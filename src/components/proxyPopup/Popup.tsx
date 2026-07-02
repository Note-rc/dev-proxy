import React, { useState, useEffect, useCallback } from "react";
import t from "../../i18n";
import chromeStore from "../../tools/chromeStore";
import RouteReplaceTool, { ProxyRule } from "./RouteReplaceTool";
import ScriptTool, { ScriptRule } from "./ScriptTool";
import RedirectTool, { RedirectRule } from "./RedirectTool";
import HeaderTool, { HeaderRule } from "./HeaderTool";
import ProxyTool, { ProxyConfig } from "./ProxyTool";
import SideNav, { TabType } from "./SideNav";
import ProfileManager from "./ProfileManager";
import { Profile } from "./types";

const Popup = () => {
  const [activeTab, setActiveTab] = useState<TabType>("header");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>("");
  const [loaded, setLoaded] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const savedProfiles = await chromeStore.get("profiles");
    const savedActiveId = await chromeStore.get("activeProfileId");

    if (savedProfiles && Array.isArray(savedProfiles) && savedProfiles.length > 0) {
      setProfiles(savedProfiles);
      setActiveProfileId(savedActiveId || savedProfiles[0].id);
    } else {
      await migrateOldData();
    }
    setLoaded(true);
  };

  const migrateOldData = async () => {
    const headerConfig = await chromeStore.get("headerConfig");
    const proxyConfig = await chromeStore.get("proxyConfig");
    const scriptConfig = await chromeStore.get("scriptConfig");
    const codeConfig = await chromeStore.get("codeConfig");
    const proxyServerConfig = await chromeStore.get("proxyServerConfig");

    const normalizeArray = <T,>(data: any): T[] => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      return [data];
    };

    const defaultProfile: Profile = {
      id: "1",
      name: `${t("scene.defaultName")} 1`,
      enabled: true,
      headerConfig: normalizeArray<HeaderRule>(headerConfig),
      proxyConfig: normalizeArray<ProxyRule>(proxyConfig),
      scriptConfig: normalizeArray<ScriptRule>(scriptConfig),
      codeConfig: normalizeArray<RedirectRule>(codeConfig),
      proxyServerConfig: proxyServerConfig || null,
    };

    setProfiles([defaultProfile]);
    setActiveProfileId(defaultProfile.id);
    await chromeStore.set("profiles", [defaultProfile]);
    await chromeStore.set("activeProfileId", defaultProfile.id);
  };

  const saveProfiles = useCallback(
    async (newProfiles: Profile[], newActiveId?: string) => {
      setProfiles(newProfiles);
      if (newActiveId) {
        setActiveProfileId(newActiveId);
      }

      const enabledProfile = newProfiles.find((p) => p.enabled);
      const legacyData: Record<string, any> = {
        profiles: newProfiles,
        headerConfig: enabledProfile?.headerConfig || [],
        scriptConfig: enabledProfile?.scriptConfig || [],
        codeConfig: enabledProfile?.codeConfig || [],
      };
      if (newActiveId) {
        legacyData.activeProfileId = newActiveId;
      }
      if (enabledProfile?.proxyServerConfig) {
        legacyData.proxyServerConfig = enabledProfile.proxyServerConfig;
      }

      await chromeStore.set(legacyData);
    },
    []
  );

  const handleProfilesChange = (newProfiles: Profile[], newActiveId?: string) => {
    saveProfiles(newProfiles, newActiveId);
  };

  const updateActiveProfile = (updater: (profile: Profile) => Profile) => {
    const newProfiles = profiles.map((p) =>
      p.id === activeProfileId ? updater(p) : p
    );
    saveProfiles(newProfiles);
  };

  const handleHeaderSubmit = (data: HeaderRule[]) => {
    updateActiveProfile((p) => ({ ...p, headerConfig: data }));
  };

  const handleProxySubmit = (data: ProxyRule[]) => {
    updateActiveProfile((p) => ({ ...p, proxyConfig: data }));
  };

  const handleScriptSubmit = (data: ScriptRule[]) => {
    updateActiveProfile((p) => ({ ...p, scriptConfig: data }));
  };

  const handleRedirectSubmit = (data: RedirectRule[]) => {
    updateActiveProfile((p) => ({ ...p, codeConfig: data }));
  };

  const handleProxyServerSubmit = (data: ProxyConfig) => {
    updateActiveProfile((p) => ({ ...p, proxyServerConfig: data }));
  };

  if (!loaded) return null;

  return (
    <div className="w-[580px] bg-white font-[PingFang_SC] dev-tools-popup flex flex-col h-[480px]">
      {/* 顶部标题栏 */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-[#eee] shrink-0">
        <span className="text-[#233895] text-base font-medium">Proxy</span>
        <button
          onClick={() => {
            window.open(
              `chrome-extension://${chrome.runtime.id}/config.html`,
              "_blank"
            );
          }}
          className="text-xs px-2 py-1 bg-[#233895] text-white rounded hover:bg-[#1a2a70] transition-colors flex items-center gap-1"
          title={t("popup.openConfigCenter")}
        >
          <svg
            className="w-3 h-3"
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
          {t("popup.configCenter")}
        </button>
      </div>

      {/* Profile 管理栏 */}
      <ProfileManager
        profiles={profiles}
        activeProfileId={activeProfileId}
        onProfileChange={handleProfilesChange}
      />

      {/* 主内容区：左侧导航 + 右侧内容 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧竖排导航 */}
        <SideNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeProfile && (
            <>
              {activeTab === "header" && (
                <HeaderTool
                  key={activeProfileId}
                  onSubmit={handleHeaderSubmit}
                  initialValue={activeProfile.headerConfig}
                />
              )}

              {activeTab === "route" && (
                <RouteReplaceTool
                  key={activeProfileId}
                  onSubmit={handleProxySubmit}
                  initialValue={activeProfile.proxyConfig}
                />
              )}

              {activeTab === "script" && (
                <ScriptTool
                  key={activeProfileId}
                  onSubmit={handleScriptSubmit}
                  initialValue={activeProfile.scriptConfig}
                />
              )}

              {activeTab === "redirect" && (
                <RedirectTool
                  key={activeProfileId}
                  onSubmit={handleRedirectSubmit}
                  initialValue={activeProfile.codeConfig}
                />
              )}

              {activeTab === "proxy" && (
                <ProxyTool
                  key={activeProfileId}
                  onSubmit={handleProxyServerSubmit}
                  initialValue={activeProfile.proxyServerConfig}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
