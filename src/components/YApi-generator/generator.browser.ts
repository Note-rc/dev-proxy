/**
 * TypeScript 代码生成器 - 浏览器版本
 */
import type { Category, InterfaceInfo } from "./fetchApi.browser";

export interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  description?: string;
}

export interface GeneratorConfig {
  dataKey?: string;
  serverUrl?: string;
  projectId?: number;
}

/**
 * 简单的 dedent 实现
 */
function dedent(strings: TemplateStringsArray, ...values: any[]): string {
  let fullString = strings.reduce((result, str, i) => {
    return result + str + (values[i] || "");
  }, "");

  fullString = fullString.replace(/^\n+|\n+$/g, "");

  const lines = fullString.split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^(\s*)/)?.[1].length || 0);

  if (indents.length === 0) return fullString;

  const minIndent = Math.min(...indents);

  return lines.map((line) => line.slice(minIndent)).join("\n");
}

/**
 * 命名转换工具
 */
const changeCase = {
  camelCase(str: string): string {
    return str
      .replace(/[_-](\w)/g, (_, c) => c.toUpperCase())
      .replace(/[^\w]/g, "")
      .replace(/^(\w)/, (_, c) => c.toLowerCase());
  },

  pascalCase(str: string): string {
    const camel = this.camelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  },
};

/**
 * 获取请求数据的 JSON Schema
 */
function getRequestDataJsonSchema(interfaceInfo: InterfaceInfo): JsonSchema {
  const schema: JsonSchema = {
    type: "object",
    required: [],
    properties: {},
  };

  // 处理路径参数
  if (interfaceInfo.req_params && interfaceInfo.req_params.length > 0) {
    for (const param of interfaceInfo.req_params) {
      schema.properties![param.name] = {
        type: mapYApiTypeToJsonSchemaType(param.type || "string"),
        description: param.desc || param.name,
      };
      schema.required!.push(param.name);
    }
  }

  // 处理查询参数
  if (interfaceInfo.req_query && interfaceInfo.req_query.length > 0) {
    for (const query of interfaceInfo.req_query) {
      schema.properties![query.name] = {
        type: mapYApiTypeToJsonSchemaType(query.type || "string"),
        description: query.desc || query.name,
      };
      if (query.required === "1") {
        schema.required!.push(query.name);
      }
    }
  }

  // 处理请求体
  if (interfaceInfo.method !== "GET" && interfaceInfo.req_body_type) {
    if (
      interfaceInfo.req_body_type === "json" &&
      interfaceInfo.req_body_other
    ) {
      try {
        const bodyData = JSON.parse(interfaceInfo.req_body_other);
        if (isJsonSchema(bodyData)) {
          Object.assign(schema, bodyData);
        } else {
          const bodySchema = jsonToJsonSchema(bodyData);
          if (bodySchema.properties) {
            Object.assign(schema.properties, bodySchema.properties);
            if (bodySchema.required) {
              schema.required!.push(...bodySchema.required);
            }
          }
        }
      } catch (error) {
        console.warn(`解析请求体失败: ${(error as Error).message}`);
      }
    } else if (
      interfaceInfo.req_body_type === "form" &&
      interfaceInfo.req_body_form
    ) {
      for (const formItem of interfaceInfo.req_body_form) {
        schema.properties![formItem.name] = {
          type: formItem.type === "file" ? "string" : "string",
          description: formItem.desc || formItem.name,
        };
        if (formItem.required === "1") {
          schema.required!.push(formItem.name);
        }
      }
    }
  }

  return schema;
}

/**
 * 获取响应数据的 JSON Schema
 */
function getResponseDataJsonSchema(
  interfaceInfo: InterfaceInfo,
  dataKey?: string
): JsonSchema {
  if (!interfaceInfo.res_body || interfaceInfo.res_body_type !== "json") {
    return { type: "object" };
  }

  try {
    const resBody = JSON.parse(interfaceInfo.res_body);

    if (isJsonSchema(resBody)) {
      if (dataKey && resBody.properties && resBody.properties[dataKey]) {
        return resBody.properties[dataKey];
      }
      return resBody;
    } else {
      const schema = jsonToJsonSchema(resBody);

      if (dataKey && schema.properties && schema.properties[dataKey]) {
        return schema.properties[dataKey];
      }

      return schema;
    }
  } catch (error) {
    console.warn(`解析响应体失败: ${(error as Error).message}`);
    return { type: "object" };
  }
}

/**
 * 判断是否是 JSON Schema
 */
function isJsonSchema(obj: any): boolean {
  return (
    obj &&
    (obj.type !== undefined ||
      obj.properties !== undefined ||
      obj.$schema !== undefined ||
      obj.$$ref !== undefined)
  );
}

/**
 * 从 JSON 对象生成 JSON Schema
 */
function jsonToJsonSchema(obj: any): JsonSchema {
  if (obj === null || obj === undefined) {
    return { type: "null" };
  }

  const type = typeof obj;

  if (type === "string") {
    return { type: "string" };
  }

  if (type === "number") {
    return { type: "number" };
  }

  if (type === "boolean") {
    return { type: "boolean" };
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return { type: "array", items: {} };
    }
    return {
      type: "array",
      items: jsonToJsonSchema(obj[0]),
    };
  }

  if (type === "object") {
    const properties: Record<string, JsonSchema> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      properties[key] = jsonToJsonSchema(value);
      if (value !== null && value !== undefined) {
        required.push(key);
      }
    }

    return {
      type: "object",
      properties,
      required,
    };
  }

  return { type: "object" };
}

/**
 * 映射 YApi 类型到 JSON Schema 类型
 */
function mapYApiTypeToJsonSchemaType(yapiType: string): string {
  const mapping: Record<string, string> = {
    string: "string",
    number: "number",
    integer: "integer",
    boolean: "boolean",
    array: "array",
    object: "object",
    file: "string",
  };

  return mapping[yapiType] || "string";
}

/**
 * 将 JSON Schema 转换为 TypeScript 类型
 */
function jsonSchemaToType(
  schema: JsonSchema,
  typeName: string,
  depth: number = 0
): string {
  if (!schema || depth > 10) {
    return `export type ${typeName} = any;`;
  }

  if (!schema.properties || Object.keys(schema.properties).length === 0) {
    if (schema.type === "array") {
      return `export type ${typeName} = any[];`;
    }
    return `export interface ${typeName} {}`;
  }

  const properties: string[] = [];
  const required = schema.required || [];

  for (const [key, value] of Object.entries(schema.properties)) {
    const isRequired = required.includes(key);
    const optional = isRequired ? "" : "?";
    const comment = value.description ? `  /** ${value.description} */\n` : "";
    const tsType = jsonSchemaTypeToTsType(value, depth + 1);

    properties.push(`${comment}  ${key}${optional}: ${tsType};`);
  }

  if (properties.length === 0) {
    return `export interface ${typeName} {}`;
  }

  return dedent`
    export interface ${typeName} {
    ${properties.join("\n")}
    }
  `;
}

/**
 * 将 JSON Schema 类型转换为 TypeScript 类型
 */
function jsonSchemaTypeToTsType(schema: JsonSchema, depth: number = 0): string {
  if (!schema || depth > 10) {
    return "any";
  }

  const type = schema.type;

  if (type === "string") {
    return "string";
  }

  if (type === "number" || type === "integer") {
    return "number";
  }

  if (type === "boolean") {
    return "boolean";
  }

  if (type === "array") {
    if (schema.items) {
      const itemType = jsonSchemaTypeToTsType(schema.items, depth + 1);
      return `${itemType}[]`;
    }
    return "any[]";
  }

  if (type === "object" || schema.properties) {
    if (schema.properties && Object.keys(schema.properties).length > 0) {
      const props: string[] = [];
      const required = schema.required || [];

      for (const [key, value] of Object.entries(schema.properties)) {
        const isRequired = required.includes(key);
        const optional = isRequired ? "" : "?";
        const comment = value.description ? `/** ${value.description} */ ` : "";
        const tsType = jsonSchemaTypeToTsType(value, depth + 1);

        props.push(`${comment}${key}${optional}: ${tsType}`);
      }

      return `{\n    ${props.join(";\n    ")};\n  }`;
    }
    return "Record<string, any>";
  }

  return "any";
}

/**
 * 生成接口注释
 */
function generateComment(interfaceInfo: InterfaceInfo): string {
  const lines = [
    "/**",
    ` * ${interfaceInfo.title}`,
    ` * `,
    ` * 分类: ${interfaceInfo._category?.name || ""}`,
    ` * 请求: ${interfaceInfo.method} ${interfaceInfo.path}`,
    ` * 更新时间: ${new Date((interfaceInfo.up_time || 0) * 1000).toLocaleString("zh-CN")}`,
  ];

  if (interfaceInfo.markdown) {
    lines.push(` * `, ` * ${interfaceInfo.markdown}`);
  }

  if (interfaceInfo._url) {
    lines.push(` * `, ` * @link ${interfaceInfo._url}`);
  }

  lines.push(" */");

  return lines.join("\n");
}

/**
 * TypeScript 代码生成器 - 浏览器版本
 */
export class TypeScriptGenerator {
  config: GeneratorConfig;

  constructor(config: GeneratorConfig) {
    this.config = config;
  }

  /**
   * 根据接口数据生成 TypeScript 代码
   */
  async generate(
    categoryList: Category[],
    onProgress?: (current: number, total: number, message: string) => void
  ): Promise<string> {
    console.log("开始生成 TypeScript 代码...");
    onProgress?.(0, 100, "开始生成代码...");

    const codes: string[] = [];

    // 生成文件头部导入
    codes.push(this.generateImports());

    // 计算总接口数
    const totalInterfaces = categoryList.reduce((sum, cat) => sum + cat.list.length, 0);
    let processedInterfaces = 0;

    // 为每个分类生成代码
    for (const category of categoryList) {
      if (category.list.length === 0) {
        continue;
      }

      console.log(`生成分类: ${category.name}`);
      codes.push(
        `\n// ==================== ${category.name} ====================\n`
      );

      // 为每个接口生成代码
      for (const interfaceInfo of category.list) {
        console.log(`  生成接口: ${interfaceInfo.title}`);

        try {
          const code = await this.generateInterfaceCode(interfaceInfo);
          codes.push(code);

          processedInterfaces++;
          const progress = Math.floor((processedInterfaces / totalInterfaces) * 100);
          onProgress?.(
            progress,
            100,
            `生成中... ${processedInterfaces}/${totalInterfaces}`
          );
        } catch (error) {
          console.error(
            `生成接口 ${interfaceInfo.title} 代码失败:`,
            (error as Error).message
          );
        }
      }
    }

    const fullCode = codes.join("\n\n");
    console.log("✅ TypeScript 代码生成完成");
    onProgress?.(100, 100, "代码生成完成");

    return fullCode;
  }

  /**
   * 生成导入语句
   */
  generateImports(): string {
    return dedent`
      /**
       * 此文件由 yapi-generator 自动生成，不建议手动修改
       * 生成时间: ${new Date().toISOString()}
       */
      
      // 请求方法枚举
      export enum Method {
        GET = 'GET',
        POST = 'POST',
        PUT = 'PUT',
        DELETE = 'DELETE',
        HEAD = 'HEAD',
        OPTIONS = 'OPTIONS',
        PATCH = 'PATCH',
      }
      
      // 请求数据类型
      export enum RequestBodyType {
        query = 'query',
        form = 'form',
        json = 'json',
        text = 'text',
        file = 'file',
        raw = 'raw',
        none = 'none',
      }
      
      // 返回数据类型
      export enum ResponseBodyType {
        json = 'json',
        text = 'text',
        xml = 'xml',
        raw = 'raw',
      }
    `;
  }

  /**
   * 生成单个接口的 TypeScript 代码
   */
  async generateInterfaceCode(interfaceInfo: InterfaceInfo): Promise<string> {
    // 生成函数名
    const functionName = this.getFunctionName(interfaceInfo);
    const requestTypeName = changeCase.pascalCase(`${functionName}Request`);
    const responseTypeName = changeCase.pascalCase(`${functionName}Response`);

    // 获取 JSON Schema
    const requestSchema = getRequestDataJsonSchema(interfaceInfo);
    const responseSchema = getResponseDataJsonSchema(
      interfaceInfo,
      this.config.dataKey
    );

    // 生成 TypeScript 类型
    const requestType = jsonSchemaToType(requestSchema, requestTypeName);
    const responseType = jsonSchemaToType(responseSchema, responseTypeName);

    // 生成注释
    const comment = generateComment(interfaceInfo);

    // 判断请求数据是否可选
    const isRequestDataOptional = /(\{\}|any)$/s.test(requestType);

    // 生成配置对象的各个属性
    const configParts = [
      `method: Method.${interfaceInfo.method}`,
      `path: '${interfaceInfo.path}'`,
      `requestBodyType: RequestBodyType.${
        interfaceInfo.method === "GET"
          ? "query"
          : interfaceInfo.req_body_type || "none"
      }`,
      `responseBodyType: ResponseBodyType.${interfaceInfo.res_body_type}`,
      `requestDataOptional: ${isRequestDataOptional}`,
    ];

    const configContent = configParts.map((part) => `  ${part},`).join("\n");

    return dedent`
      ${comment}
      ${requestType}
      
      ${comment.replace(/接口.*的/, "接口返回类型")}
      ${responseType}
      
      /**
       * 接口配置
       */
      export const ${functionName}Config = {
      ${configContent}
      } as const;
    `;
  }

  /**
   * 获取函数名称
   */
  getFunctionName(interfaceInfo: InterfaceInfo): string {
    const pathSegments = interfaceInfo.path
      .split("/")
      .filter(Boolean)
      .map((segment) => {
        return segment.replace(/[{}:]/g, "");
      })
      .filter((segment) => segment.length > 0);

    if (pathSegments.length === 0) {
      const baseName = changeCase.camelCase(interfaceInfo.title);
      const methodPrefix = interfaceInfo.method.toLowerCase();
      return `${methodPrefix}${changeCase.pascalCase(baseName)}`;
    }

    const pathName = pathSegments
      .map((segment) => {
        return changeCase.pascalCase(segment);
      })
      .join("");

    const methodPrefix = interfaceInfo.method.toLowerCase();

    return `${methodPrefix}${pathName}`;
  }
}

