/**
 * yapi-generator 配置文件
 *
 * 这个文件用于配置 YApi 项目信息和代码生成选项
 *
 * 🔑 获取 YApi token 的方法：
 * 1. 登录 YApi
 * 2. 进入项目设置
 * 3. 找到「token 配置」或「设置」->「token」
 * 4. 复制 token 值
 *
 * 📝 注意：
 * - 项目 ID 会自动从 token 获取，无需手动配置
 * - 支持按分类过滤接口（categoryIds）
 * - 支持按分类拆分成多个文件（split）
 *
 * 📚 更多配置示例请参考：
 * - config.example.js - 基础配置示例
 * - config.example.advanced.js - 高级配置示例
 * - CONFIG_OPTIMIZATION.md - 详细配置说明
 */
export const yapiConfig = {
  // YApi 服务器地址（不要以 / 结尾）
  serverUrl: "http://yapi.internal.weimob.com",

  // 项目配置列表（支持配置多个项目）
  projects: [
    {
      // 数据源类型（可选，默认 'yapi'）
      // 'yapi': 从 YApi 服务器获取数据
      // 'json': 从本地 JSON 文件读取数据
      dataSource: "yapi",
      token: "c0a46bb3ec8a01a776a516b801d591922903c643be4b25dd2bed1ceea19ba25c",
      // 输出目录（相对于项目根目录）
      outputDir: "./generated",
      // 输出文件名（当 split 为 false 时使用）
      outputFileName: "api.ts",
      // 分类 ID 列表（可选）
      // 不传或为空数组时，生成所有分类的接口
      // 传入具体的分类 ID 数组时，只生成这些分类的接口
      // 分类 ID 可以从 YApi 的分类 URL 中获取，例如：
      // http://yapi.example.com/project/9439/interface/api/cat_123
      // 其中 123 就是分类 ID
      categoryIds: [], // 例如: [123, 456]
      // 是否按分类拆分成多个文件（可选，默认 false）
      split: false,
    },
    {
      dataSource: "json",
      jsonFilePath: "./yg.api.json",
      outputDir: "./generated",
      outputFileName: "api-from-json.ts",
      categoryIds: [],
      split: false,
    },
  ],

  // 代码生成配置
  codeGenConfig: {
    // 响应数据所在的键（如果接口返回的数据格式是 { code: 0, data: {...}, message: '' }，这里就填 'data'）
    // 如果返回的直接就是数据，可以不填或设为 undefined
    dataKey: undefined,
  },
};
