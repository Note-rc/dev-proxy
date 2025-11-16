import React, { useState, useEffect } from "react";
import { Form, Toast } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";

// 代理模式枚举
export enum ProxyMode {
  SYSTEM = "system", // 系统代理
  DIRECT = "direct", // 直接连接
  CUSTOM = "custom", // 自定义模式
}

// 代理服务器配置
export interface ProxyServer {
  host: string;
  port: number;
}

// 代理规则
export interface ProxyRuleItem {
  id: string;
  pattern: string; // URL匹配模式
  enabled: boolean;
}

// 完整的代理配置
export interface ProxyConfig {
  mode: ProxyMode;
  server?: ProxyServer; // 自定义模式下的代理服务器
  rules: ProxyRuleItem[]; // 代理规则列表
}

interface IProps {
  onSubmit: (data: ProxyConfig) => void;
  initialValue?: ProxyConfig | null;
}

const ProxyTool = ({ onSubmit, initialValue }: IProps) => {
  // 代理配置状态
  const [config, setConfig] = useState<ProxyConfig>(
    initialValue || {
      mode: ProxyMode.DIRECT,
      rules: [],
    }
  );

  // 代理服务器配置表单状态
  const [serverForm, setServerForm] = useState<ProxyServer>({
    host: "",
    port: 8080,
  });

  // Toast状态
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  // 错误消息
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialValue) {
      setConfig(initialValue);
      if (initialValue.server) {
        setServerForm(initialValue.server);
      }
    }
  }, [initialValue]);

  // 显示Toast
  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMessage(msg);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000);
  };

  // 切换代理模式
  const handleModeChange = async (mode: ProxyMode) => {
    const newConfig = { ...config, mode };
    try {
      await onSubmit(newConfig);
      setConfig(newConfig);
    } catch (error) {
      console.error("切换模式失败", error);
    }
  };

  // 保存代理服务器配置
  const handleServerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!serverForm.host) {
      setMessage("请输入代理服务器地址");
      return;
    }

    if (!serverForm.port || serverForm.port < 1 || serverForm.port > 65535) {
      setMessage("请输入有效的端口号 (1-65535)");
      return;
    }

    const newConfig = {
      ...config,
      server: serverForm,
    };

    try {
      await onSubmit(newConfig);
      setConfig(newConfig);
      setMessage("");
      showToast("success", "代理服务器配置已保存");
    } catch (error) {
      showToast("error", "保存失败");
    }
  };

  // 获取模式标签
  const getModeLabel = (mode: ProxyMode): string => {
    switch (mode) {
      case ProxyMode.SYSTEM:
        return "系统代理";
      case ProxyMode.DIRECT:
        return "直接连接";
      case ProxyMode.CUSTOM:
        return "自定义模式";
      default:
        return "";
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="w-full">
        {/* 代理模式选择 */}
        <div className="mb-4">
          <div className="text-xs font-medium mb-2 text-[#666]">代理模式</div>
          <div className="flex flex-col gap-2">
            {Object.values(ProxyMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`w-full text-left px-3 py-2 rounded border transition-all ${
                  config.mode === mode
                    ? "bg-[#233895] text-white border-[#233895]"
                    : "bg-white text-[#333] border-[#ddd] hover:border-[#233895]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {getModeLabel(mode)}
                  </span>
                  {config.mode === mode && <CheckIcon className="w-4 h-4" />}
                </div>
                <div className="text-xs mt-1 opacity-80">
                  {mode === ProxyMode.SYSTEM && "使用系统配置的代理设置"}
                  {mode === ProxyMode.DIRECT && "不使用代理，直接连接"}
                  {mode === ProxyMode.CUSTOM && "使用自定义代理服务器（建议配合 whistle 使用）"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 自定义模式配置 */}
        {config.mode === ProxyMode.CUSTOM && (
          <div className="p-3 bg-[#f5f5f5] rounded">
            <div className="text-xs font-medium mb-2 text-[#666]">
              代理服务器配置
            </div>
            <div className="text-xs text-[#888] mb-2 p-2 bg-[#fff9e6] border border-[#ffe7a0] rounded">
              💡 建议配合 <a href="https://github.com/avwo/whistle" target="_blank" rel="noopener noreferrer" className="text-[#233895] underline">whistle</a> 一起使用
            </div>
            <Form.Root onSubmit={handleServerSubmit}>
              <div className="space-y-2">
                <Form.Field name="host">
                  <input
                    type="text"
                    value={serverForm.host}
                    onChange={(e) => {
                      setServerForm({ ...serverForm, host: e.target.value });
                      message && setMessage("");
                    }}
                    placeholder="代理服务器地址 (例如: 127.0.0.1)"
                    className="w-full border border-[#ddd] rounded text-xs p-2"
                  />
                </Form.Field>

                <Form.Field name="port">
                  <input
                    type="number"
                    value={serverForm.port}
                    onChange={(e) => {
                      setServerForm({
                        ...serverForm,
                        port: parseInt(e.target.value) || 0,
                      });
                      message && setMessage("");
                    }}
                    placeholder="端口号"
                    className="w-full border border-[#ddd] rounded text-xs p-2"
                  />
                </Form.Field>

                {message && (
                  <p className="text-[#ff4d4f] text-xs">{message}</p>
                )}

                <button
                  type="submit"
                  className="w-full text-xs p-2 bg-[#233895] text-white rounded hover:bg-[#1a2b75] transition-colors"
                >
                  保存服务器配置
                </button>
              </div>
            </Form.Root>
          </div>
        )}
      </div>

      {/* Toast通知 */}
      <Toast.Root
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-md ${
          toastType === "success"
            ? "bg-[#f6ffed] border border-[#b7eb8f]"
            : "bg-[#fff2f0] border border-[#ffccc7]"
        }`}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title
          className={
            toastType === "success" ? "text-[#52c41a]" : "text-[#ff4d4f]"
          }
        >
          {toastMessage}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed inset-0 flex items-center justify-center p-4 m-0 z-50" />
    </Toast.Provider>
  );
};

export default ProxyTool;
