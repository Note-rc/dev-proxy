import React, { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  TrashIcon,
  Pencil1Icon,
  CopyIcon,
  PauseIcon,
  PlayIcon,
  CheckCircledIcon,
} from "@radix-ui/react-icons";
import { Profile } from "./types";
import t from "../../i18n";

interface ProfileManagerProps {
  profiles: Profile[];
  activeProfileId: string;
  onProfileChange: (profiles: Profile[]) => void;
  onActiveProfileChange: (id: string) => void;
}

const ProfileManager = ({
  profiles,
  activeProfileId,
  onProfileChange,
  onActiveProfileChange,
}: ProfileManagerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);
  const hasEnabledProfile = profiles.some((p) => p.enabled);

  const handleSwitchProfile = (id: string) => {
    const newProfiles = profiles.map((p) => ({
      ...p,
      enabled: p.id === id,
    }));
    onProfileChange(newProfiles);
    onActiveProfileChange(id);
  };

  const handleTogglePause = () => {
    if (!activeProfile) return;
    if (activeProfile.enabled) {
      const newProfiles = profiles.map((p) => ({ ...p, enabled: false }));
      onProfileChange(newProfiles);
    } else {
      handleSwitchProfile(activeProfileId);
    }
  };

  const handleAddProfile = () => {
    const newProfile: Profile = {
      id: Date.now().toString(),
      name: `${t("scene.defaultName")} ${profiles.length + 1}`,
      enabled: true,
      headerConfig: [],
      proxyConfig: [],
      scriptConfig: [],
      codeConfig: [],
      proxyServerConfig: null,
    };
    const newProfiles = profiles.map((p) => ({ ...p, enabled: false }));
    newProfiles.push(newProfile);
    onProfileChange(newProfiles);
    onActiveProfileChange(newProfile.id);
  };

  const handleDuplicateProfile = () => {
    if (!activeProfile) return;
    const newProfile: Profile = {
      ...JSON.parse(JSON.stringify(activeProfile)),
      id: Date.now().toString(),
      name: `${activeProfile.name} (copy)`,
      enabled: true,
    };
    const newProfiles = profiles.map((p) => ({ ...p, enabled: false }));
    newProfiles.push(newProfile);
    onProfileChange(newProfiles);
    onActiveProfileChange(newProfile.id);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) return;
    const newProfiles = profiles.filter((p) => p.id !== id);
    if (activeProfileId === id) {
      newProfiles[0].enabled = true;
      onActiveProfileChange(newProfiles[0].id);
    }
    onProfileChange(newProfiles);
  };

  const handleStartRename = (profile: Profile) => {
    setEditingId(profile.id);
    setEditingName(profile.name);
  };

  const handleFinishRename = () => {
    if (editingId && editingName.trim()) {
      const newProfiles = profiles.map((p) =>
        p.id === editingId ? { ...p, name: editingName.trim() } : p
      );
      onProfileChange(newProfiles);
    }
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#f0f2f5] border-b border-[#ddd] min-h-[36px]">
      {/* 场景切换按钮组 */}
      <div className="flex items-center gap-1 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleSwitchProfile(profile.id)}
            onDoubleClick={() => handleStartRename(profile)}
            className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-all shrink-0 ${
              profile.enabled
                ? "bg-[#233895] text-white"
                : profile.id === activeProfileId
                ? "bg-[#e8eaf6] text-[#233895] border border-[#233895]"
                : "bg-white text-[#333] border border-[#ddd] hover:border-[#233895]"
            }`}
            title={profile.name + (profile.enabled ? ` (${t("scene.active")})` : "")}
          >
            {editingId === profile.id ? (
              <input
                ref={inputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleFinishRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishRename();
                  if (e.key === "Escape") {
                    setEditingId(null);
                    setEditingName("");
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-16 bg-transparent border-none outline-none text-xs text-inherit"
              />
            ) : (
              <>
                <span className="truncate max-w-[80px]">{profile.name}</span>
                {profile.enabled && (
                  <CheckCircledIcon className="w-3 h-3 shrink-0" />
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* 操作按钮组 */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={handleTogglePause}
          className={`p-1 rounded hover:bg-[#e0e0e0] transition-colors ${
            hasEnabledProfile ? "text-[#52c41a]" : "text-[#ff4d4f]"
          }`}
          title={hasEnabledProfile ? t("scene.pause") : t("scene.resume")}
        >
          {hasEnabledProfile ? (
            <PauseIcon className="w-3.5 h-3.5" />
          ) : (
            <PlayIcon className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={() => activeProfile && handleStartRename(activeProfile)}
          className="p-1 text-[#666] rounded hover:bg-[#e0e0e0] transition-colors"
          title={t("scene.rename")}
        >
          <Pencil1Icon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDuplicateProfile}
          className="p-1 text-[#666] rounded hover:bg-[#e0e0e0] transition-colors"
          title={t("scene.duplicate")}
        >
          <CopyIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleAddProfile}
          className="p-1 text-[#233895] rounded hover:bg-[#e0e0e0] transition-colors"
          title={t("scene.add")}
        >
          <PlusIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => handleDeleteProfile(activeProfileId)}
          className={`p-1 rounded hover:bg-[#e0e0e0] transition-colors ${
            profiles.length <= 1
              ? "text-[#ccc] cursor-not-allowed"
              : "text-[#ff4d4f]"
          }`}
          disabled={profiles.length <= 1}
          title={t("scene.delete")}
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProfileManager;
