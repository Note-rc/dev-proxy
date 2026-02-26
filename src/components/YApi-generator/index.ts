/**
 * yapi-generator 生成器主入口
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import { YApiFetcher } from "./fetchApi.js";
import { TypeScriptGenerator } from "./generator.js";
import type { YApiConfig, Category } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 加载配置文件
 * 优先级：
 * 1. yg.config.js/ts 存在时，使用其配置
 * 2. 配置文件不存在但 yg.api.json 存在时，使用默认配置从 JSON 生成
 * 3. 都不存在时，抛出错误
 */
async function loadConfig(): Promise<YApiConfig> {
  const rootDir = path.resolve(__dirname, "../../");
  const jsonPath = path.resolve(rootDir, "yg.api.json");

  // 尝试加载配置文件（支持 .js, .mjs, .cjs, .ts）
  const configExtensions = [".js", ".mjs", ".cjs", ".ts"];
  let configFound = false;
  let yapiConfig: YApiConfig | null = null;

  for (const ext of configExtensions) {
    const configPath = path.resolve(rootDir, `yg.config${ext}`);
    if (fs.existsSync(configPath)) {
      console.log(`✅ 检测到配置文件: yg.config${ext}`);
      configFound = true;

      try {
        if (ext === ".ts") {
          // 对于 TypeScript 文件，读取并手动解析（简单方式）
          const configContent = fs.readFileSync(configPath, "utf-8");

          // 移除 export 语句并提取配置对象
          const yapiConfigMatch = configContent.match(
            /export\s+const\s+yapiConfig\s*=\s*({[\s\S]*?});?\s*$/m
          );

          if (!yapiConfigMatch) {
            throw new Error(
              "无法解析 TypeScript 配置文件：未找到 yapiConfig 导出"
            );
          }

          // 使用 Function 构造函数安全地评估配置对象
          const configStr = yapiConfigMatch[1];
          yapiConfig = new Function(`return ${configStr}`)() as YApiConfig;

          console.log("📝 已成功加载 TypeScript 配置文件\n");
        } else {
          // 对于 JavaScript 文件，可以直接导入
          const configUrl = pathToFileURL(configPath).href + "?t=" + Date.now();
          const configModule = await import(configUrl);
          yapiConfig = configModule.yapiConfig;
        }

        return yapiConfig;
      } catch (error) {
        throw new Error(`加载配置文件失败: ${(error as Error).message}`);
      }
    }
  }

  // 如果配置文件不存在，检查是否有 yg.api.json
  if (!configFound && fs.existsSync(jsonPath)) {
    console.log("⚠️  未找到配置文件，但检测到 yg.api.json");
    console.log("📝 将使用默认配置从 JSON 文件生成代码\n");

    // 返回默认配置
    return {
      serverUrl: "http://yapi.internal.weimob.com",
      projects: [
        {
          dataSource: "json",
          jsonFilePath: "./yg.api.json",
          outputDir: "./generated",
          outputFileName: "api-from-json.ts",
          categoryIds: [],
          split: false,
        },
      ],
      codeGenConfig: {
        dataKey: undefined,
      },
    };
  }

  // 两个文件都不存在，抛出错误
  throw new Error(
    `❌ 配置文件和数据文件都不存在！\n` +
      `请确保以下文件至少存在一个：\n` +
      `  - yg.config.{js,mjs,cjs,ts} (配置文件)\n` +
      `  - yg.api.json (API 数据文件)`
  );
}

/**
 * 主函数
 * @returns 如果所有项目都配置了 getString，则返回生成的代码字符串数组，否则返回 void
 */
async function main(_yapiConfig?: YApiConfig): Promise<string[] | void> {
  console.log("========================================");
  console.log("  yapi-generator 代码生成器");
  console.log("========================================\n");

  // 加载配置
  let yapiConfig: YApiConfig = _yapiConfig || null;
  if (!yapiConfig) {
    try {
      yapiConfig = await loadConfig();
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  }

  // 收集生成的代码字符串
  const allGeneratedCode: string[] = [];

  // 遍历所有项目配置
  for (const projectConfig of yapiConfig.projects) {
    console.log(`\n开始处理项目`);
    console.log("----------------------------------------\n");

    try {
      let categoryList: Category[];
      let projectId: number;

      // 根据数据源类型获取数据
      const dataSource = projectConfig.dataSource || "yapi";

      if (dataSource === "json") {
        // 从 JSON 文件读取数据
        console.log("📄 数据源: JSON 文件");
        const jsonFilePath = path.resolve(
          __dirname,
          "../../",
          projectConfig.jsonFilePath!
        );
        console.log(`文件路径: ${jsonFilePath}\n`);

        if (!fs.existsSync(jsonFilePath)) {
          throw new Error(`JSON 文件不存在: ${jsonFilePath}`);
        }

        const jsonContent = fs.readFileSync(jsonFilePath, "utf-8");
        const rawData = JSON.parse(jsonContent) as Category[];

        // 从 JSON 数据中提取项目 ID（如果有）
        if (rawData.length > 0 && rawData[0].list.length > 0) {
          projectId = rawData[0].list[0].project_id || 0;
        } else {
          projectId = 0;
        }

        // 处理 JSON 数据，补充必要的字段
        categoryList = rawData.map((category) => {
          // 确保分类有 _id 字段
          if (!category._id) {
            category._id = category.catid || 0;
          }

          // 补充 _url 字段
          if (!category._url) {
            category._url = `${yapiConfig.serverUrl}/project/${projectId}/interface/api/cat_${category._id}`;
          }

          // 处理分类中的每个接口
          category.list = category.list.map((interfaceInfo) => {
            // 补充 _category 信息
            if (!interfaceInfo._category) {
              interfaceInfo._category = {
                _id: category._id,
                name: category.name,
                desc: category.desc || "",
                _url: category._url,
              };
            }

            // 补充 _project 信息
            if (!interfaceInfo._project) {
              interfaceInfo._project = {
                _id: projectId,
                name: "项目",
                basepath: "",
                _url: `${yapiConfig.serverUrl}/project/${projectId}`,
              };
            }

            // 补充 _url 字段
            if (!interfaceInfo._url) {
              interfaceInfo._url = `${yapiConfig.serverUrl}/project/${projectId}/interface/api/${interfaceInfo._id}`;
            }

            return interfaceInfo;
          });

          return category;
        });

        // 过滤分类（如果指定了 categoryIds）
        if (projectConfig.categoryIds && projectConfig.categoryIds.length > 0) {
          categoryList = categoryList.filter((cat) =>
            projectConfig.categoryIds!.includes(cat._id)
          );
          console.log(`已过滤分类，只保留 ${categoryList.length} 个指定的分类`);
        }

        console.log(`共 ${categoryList.length} 个分类`);
        const totalInterfaces = categoryList.reduce(
          (sum, cat) => sum + cat.list.length,
          0
        );
        console.log(`共 ${totalInterfaces} 个接口\n`);
      } else {
        // 从 YApi 服务器获取数据
        console.log("🌐 数据源: YApi 服务器");

        const fetcher = new YApiFetcher(
          yapiConfig.serverUrl,
          projectConfig.token!,
          projectConfig.categoryIds || []
        );

        categoryList = await fetcher.getAllInterfacesWithDetails();
        projectId = fetcher.projectId!;
      }

      // 保存原始数据（可选，用于调试）
      // const dataPath = path.resolve(__dirname, '../../generated/yapi-data.json');
      // fs.writeFileSync(dataPath, JSON.stringify(categoryList, null, 2), 'utf-8');
      // console.log(`\n原始数据已保存到: ${dataPath}`);

      // 3. 创建代码生成器
      const generator = new TypeScriptGenerator({
        ...yapiConfig.codeGenConfig,
        serverUrl: yapiConfig.serverUrl,
        projectId: projectId,
      });

      // 4. 根据配置决定是生成单个文件还是多个文件，或返回字符串
      const getString = projectConfig.getString || false;
      const split = projectConfig.split || false;

      if (getString) {
        // 返回字符串模式，不生成文件
        console.log("\n🔤 字符串返回模式");

        if (split) {
          // 按分类拆分，但返回字符串数组
          const codes: string[] = [];
          for (const category of categoryList) {
            if (category.list.length === 0) {
              console.log(`⏭️  跳过空分类: ${category.name}`);
              continue;
            }

            console.log(`生成分类代码: ${category.name}`);
            const code = await generator.generate([category]);
            codes.push(code);
          }
          allGeneratedCode.push(...codes);
          console.log(`\n✅ 共生成 ${codes.length} 个分类的代码字符串`);
        } else {
          // 生成单个代码字符串
          const code = await generator.generate(categoryList);
          allGeneratedCode.push(code);
          console.log(`\n✅ 代码字符串生成完成`);
        }
      } else {
        // 文件生成模式
        const outputDir = path.resolve(
          __dirname,
          "../../",
          projectConfig.outputDir
        );

        if (split) {
          // 按分类拆分成多个文件
          console.log("\n📁 按分类拆分文件模式");
          console.log(`输出目录: ${outputDir}\n`);

          for (const category of categoryList) {
            if (category.list.length === 0) {
              console.log(`⏭️  跳过空分类: ${category.name}`);
              continue;
            }

            console.log(`生成分类文件: ${category.name}`);

            // 为单个分类生成代码
            const code = await generator.generate([category]);

            // 生成安全的文件名（移除特殊字符）
            const safeFileName = category.name
              .replace(/[/\\:*?"<>|]/g, "-")
              .replace(/\s+/g, "-")
              .toLowerCase();

            const outputPath = path.resolve(outputDir, `${safeFileName}.ts`);
            await generator.saveToFile(code, outputPath);
          }

          console.log(
            `\n✅ 共生成 ${
              categoryList.filter((c) => c.list.length > 0).length
            } 个分类文件`
          );
        } else {
          // 生成单个文件
          console.log("\n📄 单文件模式");

          // 生成 TypeScript 代码
          const code = await generator.generate(categoryList);

          // 保存到文件
          const outputPath = path.resolve(
            outputDir,
            projectConfig.outputFileName
          );
          await generator.saveToFile(code, outputPath);
        }
      }

      console.log("\n✅ 项目处理完成！");
    } catch (error) {
      console.error(`\n❌ 项目处理失败:`, (error as Error).message);
      console.error((error as Error).stack);
    }
  }

  console.log("\n========================================");
  console.log("  所有项目处理完成");
  console.log("========================================\n");

  // 如果有收集到的代码字符串，则返回
  if (allGeneratedCode.length > 0) {
    return allGeneratedCode;
  }
}

// 导出 main 函数，以便可以被其他模块调用
export { main };

// 运行主函数（当作为入口文件直接运行时）
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("程序执行失败:", error);
    process.exit(1);
  });
}
