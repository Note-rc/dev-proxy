import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import t, { loadSavedLocale } from "./i18n";

const HelpPage: React.FC = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadSavedLocale().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* 标题部分 */}
        <div className="bg-gradient-to-r from-[#233895] to-[#4158d0] text-white p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dev Proxy</h1>
              <p className="text-lg opacity-90">
                {t("help.subtitle")}
              </p>
            </div>
            <button
              onClick={() => {
                window.open(
                  `chrome-extension://${chrome.runtime.id}/config.html`,
                  "_blank",
                );
              }}
              className="px-6 py-3 bg-white text-[#233895] rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2 shadow-md"
              title={t("help.openConfigCenter")}
            >
              <svg
                className="w-5 h-5"
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
              {t("help.configCenter")}
            </button>
          </div>
        </div>

        {/* 功能介绍 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.featureOverview")}
          </h2>
          <p className="text-gray-700 mb-4">
            {t("help.featureOverviewDesc")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                {t("help.headerModifyTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("help.headerModifyDesc")}
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                {t("help.routeReplaceTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("help.routeReplaceDesc")}
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                {t("help.scriptReplaceTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("help.scriptReplaceDesc")}
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                {t("help.jsRedirectTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("help.jsRedirectDesc")}
              </p>
            </div>
            <div className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#233895] mb-2">
                {t("help.proxyServerTitle")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("help.proxyServerDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* whistle 推荐 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            {t("help.recommendedTool")}
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("help.whistleTitle")}
            </h3>
            <p className="text-gray-700 mb-3">
              <a
                href="https://github.com/avwo/whistle"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                whistle
              </a>{" "}
              {t("help.whistleDesc")}
            </p>
            <div className="bg-white rounded p-4 mb-3">
              <h4 className="font-semibold text-gray-800 mb-2">{t("help.whistleFeatures")}</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>{t("help.whistleFeature1")}</li>
                <li>{t("help.whistleFeature2")}</li>
                <li>{t("help.whistleFeature3")}</li>
                <li>{t("help.whistleFeature4")}</li>
                <li>{t("help.whistleFeature5")}</li>
              </ul>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-gray-700">
                <strong>{t("help.whistleUsageTip")}</strong>{" "}
                {t("help.whistleUsageDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* 请求头修改 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.headerModifySectionTitle")}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.featureDesc")}
            </h3>
            <p className="text-gray-700 mb-2">
              {t("help.headerModifyFeatureDesc")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.useCases")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>{t("help.headerUseCase1")}</li>
              <li>{t("help.headerUseCase2")}</li>
              <li>{t("help.headerUseCase3")}</li>
              <li>{t("help.headerUseCase4")}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.configDesc")}
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.headerNameDesc")}</strong>
                {t("help.headerNameDescDetail")}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.headerValueDesc")}</strong>
                {t("help.headerValueDescDetail")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("help.urlMatchDesc")}</strong>
                {t("help.urlMatchDescDetail")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("help.example")}</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <p className="text-green-400 mb-2">
                {t("help.headerExample1Comment")}
              </p>
              <p>{t("help.headerExample1Name")}</p>
              <p>{t("help.headerExample1Value")}</p>
              <p>{t("help.headerExample1Match")}</p>
              <p className="mt-3 text-green-400">
                {t("help.headerExample2Comment")}
              </p>
              <p>{t("help.headerExample2Name")}</p>
              <p>{t("help.headerExample2Value")}</p>
              <p>{t("help.headerExample2Match")}</p>
            </div>
          </div>
        </div>

        {/* 路由替换 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.routeReplaceSectionTitle")}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.featureDesc")}
            </h3>
            <p className="text-gray-700 mb-2">
              {t("help.routeReplaceFeatureDesc")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.useCases")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>{t("help.routeUseCase1")}</li>
              <li>{t("help.routeUseCase2")}</li>
              <li>{t("help.routeUseCase3")}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.configDesc")}
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.sourcePrefixDesc")}</strong>
                {t("help.sourcePrefixDescDetail")}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.targetPrefixDesc")}</strong>
                {t("help.targetPrefixDescDetail")}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.globalDesc")}</strong>
                {t("help.globalDescDetail")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("help.specificUrlDesc")}</strong>
                {t("help.specificUrlDescDetail")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("help.example")}</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <p className="text-green-400 mb-2">{t("help.routeExampleComment")}</p>
              <p>{t("help.routeExampleSource")}</p>
              <p>{t("help.routeExampleTarget")}</p>
              <p className="mt-2 text-gray-400">{t("help.routeExampleEffect")}</p>
              <p className="text-yellow-300">
                {t("help.routeExampleResult")}
              </p>
            </div>
          </div>
        </div>

        {/* 脚本替换 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.scriptReplaceSectionTitle")}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.featureDesc")}
            </h3>
            <p className="text-gray-700 mb-2">
              {t("help.scriptReplaceFeatureDesc")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.useCases")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>{t("help.scriptUseCase1")}</li>
              <li>{t("help.scriptUseCase2")}</li>
              <li>{t("help.scriptUseCase3")}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.configDesc")}
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.scriptUrlDesc")}</strong>
                {t("help.scriptUrlDescDetail")}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.replacementDesc")}</strong>
                {t("help.replacementDescDetail")}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.globalDesc")}</strong>
                {t("help.globalDescDetail")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("help.specificUrlDesc")}</strong>
                {t("help.specificUrlDescDetail")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.scriptNote")}
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-gray-700">
                {t("help.scriptNoteContent")}
              </p>
            </div>
          </div>
        </div>

        {/* JS重定向 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.jsRedirectSectionTitle")}
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.featureDesc")}
            </h3>
            <p className="text-gray-700 mb-2">
              {t("help.jsRedirectFeatureDesc")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.useCases")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>{t("help.redirectUseCase1")}</li>
              <li>{t("help.redirectUseCase2")}</li>
              <li>{t("help.redirectUseCase3")}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.configDesc")}
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.codeUrlDesc")}</strong>
                {t("help.codeUrlDescDetail")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("help.redirectUrlDesc")}</strong>
                {t("help.redirectUrlDescDetail")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("help.example")}</h3>
            <div className="bg-gray-900 text-white p-4 rounded font-mono text-sm">
              <p className="text-green-400 mb-2">
                {t("help.redirectExampleComment")}
              </p>
              <p>{t("help.redirectExampleSource")}</p>
              <p>{t("help.redirectExampleTarget")}</p>
            </div>
          </div>
        </div>

        {/* Cookie管理 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">{t("help.cookieTitle")}</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.featureDesc")}
            </h3>
            <p className="text-gray-700 mb-2">
              {t("help.cookieFeatureDesc")}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.useCases")}
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>{t("help.cookieUseCase1")}</li>
              <li>{t("help.cookieUseCase2")}</li>
              <li>{t("help.cookieUseCase3")}</li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.configDesc")}
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>{t("help.sourceDomainDesc")}</strong>
                {t("help.sourceDomainDescDetail")}
              </p>
              <p className="text-sm text-gray-700">
                <strong>{t("help.targetDomainDesc")}</strong>
                {t("help.targetDomainDescDetail")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("help.scriptNote")}
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                <li>{t("help.cookieNote1")}</li>
                <li>{t("help.cookieNote2")}</li>
                <li>{t("help.cookieNote3")}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.faqTitle")}
          </h2>

          <div className="space-y-4">
            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t("help.faq1Q")}
              </h3>
              <p className="text-gray-700 text-sm">
                {t("help.faq1A")}
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t("help.faq2Q")}
              </h3>
              <p className="text-gray-700 text-sm">
                {t("help.faq2A")}
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t("help.faq3Q")}
              </h3>
              <p className="text-gray-700 text-sm">
                {t("help.faq3A")}
              </p>
            </div>

            <div className="border-l-4 border-[#233895] pl-4">
              <h3 className="font-semibold text-gray-800 mb-1">
                {t("help.faq4Q")}
              </h3>
              <p className="text-gray-700 text-sm">
                {t("help.faq4A")}
              </p>
            </div>
          </div>
        </div>

        {/* 快速开始 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#233895] mb-4">
            {t("help.quickStart")}
          </h2>

          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                1
              </span>
              <p className="text-gray-700">
                {t("help.step1")}
              </p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                2
              </span>
              <p className="text-gray-700">
                {t("help.step2")}
              </p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                3
              </span>
              <p className="text-gray-700">{t("help.step3")}</p>
            </div>
            <div className="flex items-start">
              <span className="bg-[#233895] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                4
              </span>
              <p className="text-gray-700">{t("help.step4")}</p>
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <div className="text-center text-gray-500 text-sm mt-8 pb-8">
          <p>{t("help.version")}</p>
          <p className="mt-2">{t("help.footer")}</p>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<HelpPage />);
