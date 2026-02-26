// src/popup.tsx
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { YApiFetcher } from "./components/YApi-generator/fetchApi.browser";
import { TypeScriptGenerator } from "./components/YApi-generator/generator.browser";

interface FormData {
  serverUrl: string;
  token: string;
  categoryIds: string;
  dataKey: string;
}

interface ProgressInfo {
  current: number;
  total: number;
  message: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    serverUrl: "http://yapi.internal.weimob.com",
    token: "",
    categoryIds: "",
    dataKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    // 验证表单
    if (!formData.serverUrl.trim()) {
      setError("请输入 YApi 服务器地址");
      return;
    }
    if (!formData.token.trim()) {
      setError("请输入项目 Token");
      return;
    }

    setError("");
    setLoading(true);
    setProgress({ current: 0, total: 100, message: "开始生成..." });

    try {
      // 解析 categoryIds
      const categoryIds = formData.categoryIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      // 创建 fetcher
      const fetcher = new YApiFetcher(
        formData.serverUrl,
        formData.token,
        categoryIds
      );

      // 获取接口数据
      const categoryList = await fetcher.getAllInterfacesWithDetails(
        (current, total, message) => {
          setProgress({ current, total, message });
        }
      );

      if (categoryList.length === 0) {
        throw new Error("未获取到任何接口数据");
      }

      // 获取项目名称
      const projectName = categoryList[0]?.list[0]?._project?.name || "project";

      // 创建生成器
      const generator = new TypeScriptGenerator({
        dataKey: formData.dataKey.trim() || undefined,
        serverUrl: formData.serverUrl,
        projectId: fetcher.projectId || undefined,
      });

      // split 为 true，按分类生成多个文件
      const timestamp = Date.now();

      for (let i = 0; i < categoryList.length; i++) {
        const category = categoryList[i];
        if (category.list.length === 0) {
          continue;
        }

        setProgress({
          current: 90 + Math.floor((i / categoryList.length) * 10),
          total: 100,
          message: `正在生成文件 ${i + 1}/${categoryList.length}: ${category.name}`,
        });

        // 生成单个分类的代码
        const code = await generator.generate([category], (current, total, message) => {
          setProgress({ current, total, message });
        });

        // 生成文件名: projectName + "api" + 分类名 + timestamp
        const safeFileName = category.name
          .replace(/[/\\:*?"<>|]/g, "-")
          .replace(/\s+/g, "-")
          .toLowerCase();
        const filename = `${projectName}-api-${safeFileName}-${timestamp}.ts`;

        // 下载文件
        downloadFile(code, filename);
      }

      setProgress({ current: 100, total: 100, message: "生成完成！" });

      // 2秒后清除进度
      setTimeout(() => {
        setProgress(null);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("生成失败:", err);
      setError((err as Error).message || "生成失败，请检查配置");
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-w-[400px] max-w-[500px] p-6 bg-base-100">
      <h1 className="text-2xl font-bold mb-6 text-center">YApi 代码生成器</h1>

      <div className="space-y-4">
        {/* Server URL */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">YApi 服务器地址</span>
          </label>
          <input
            type="text"
            name="serverUrl"
            value={formData.serverUrl}
            onChange={handleInputChange}
            placeholder="http://yapi.example.com"
            className="input input-bordered w-full"
            disabled={loading}
          />
        </div>

        {/* Token */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">项目 Token</span>
          </label>
          <textarea
            name="token"
            value={formData.token}
            onChange={handleInputChange}
            placeholder="请输入项目 Token"
            className="textarea textarea-bordered w-full h-20"
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              在 YApi 项目设置 → Token 配置中获取
            </span>
          </label>
        </div>

        {/* Category IDs */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">分类 ID（可选）</span>
          </label>
          <input
            type="text"
            name="categoryIds"
            value={formData.categoryIds}
            onChange={handleInputChange}
            placeholder="例如: 123,456"
            className="input input-bordered w-full"
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              多个分类用逗号分隔，留空则生成所有分类
            </span>
          </label>
        </div>

        {/* Data Key */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">响应数据键（可选）</span>
          </label>
          <input
            type="text"
            name="dataKey"
            value={formData.dataKey}
            onChange={handleInputChange}
            placeholder="例如: data"
            className="input input-bordered w-full"
            disabled={loading}
          />
          <label className="label">
            <span className="label-text-alt text-gray-500">
              如果接口返回格式为 {"{code, data, message}"}，填写 data
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.message}</span>
              <span>{progress.current}%</span>
            </div>
            <progress
              className="progress progress-primary w-full"
              value={progress.current}
              max={progress.total}
            ></progress>
          </div>
        )}

        {/* Generate Button */}
        <button
          className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "生成中..." : "生成代码"}
        </button>

        {/* Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• 生成的代码将按分类拆分成多个文件</p>
          <p>• 文件名格式: 项目名-api-分类名-时间戳.ts</p>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
