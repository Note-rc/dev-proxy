/**
 * YApi 数据获取模块
 * 根据 YApi 开放 API 文档实现：https://hellosean1025.github.io/yapi/openapi.html
 */
import fetch from "node-fetch";
import type { Category, InterfaceInfo, CategoryInfo } from "../types.js";

interface YApiResponse<T = any> {
  errcode: number;
  errmsg?: string;
  data: T;
}

interface ProjectData {
  _id: number;
  name: string;
  desc?: string;
  basepath?: string;
  tag?: string[];
  env?: any[];
  add_time?: number;
  up_time?: number;
}

interface CategoryMenuData {
  _id: number;
  name: string;
  desc?: string;
  add_time?: number;
  up_time?: number;
  list?: Array<{
    _id: number;
    title: string;
    path: string;
    method: string;
    catid: number;
  }>;
}

interface InterfaceListData {
  count: number;
  total: number;
  list: Array<{
    _id: number;
    title: string;
    path: string;
    method: string;
    catid: number;
    project_id: number;
  }>;
}

/**
 * YApi 数据获取器
 */
export class YApiFetcher {
  serverUrl: string;
  token: string;
  categoryIds: number[];
  projectId: number | null;

  constructor(serverUrl: string, token: string, categoryIds: number[] = []) {
    this.serverUrl = serverUrl;
    this.token = token;
    this.categoryIds = categoryIds;
    this.projectId = null; // 将从项目信息中获取
  }

  /**
   * 获取项目基本信息（通过 token 自动获取）
   */
  async getProjectInfo(): Promise<ProjectData> {
    const url = `${this.serverUrl}/api/project/get?token=${this.token}`;

    try {
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<ProjectData>;

      if (data.errcode !== 0) {
        throw new Error(`获取项目信息失败: ${data.errmsg}`);
      }

      // 保存项目 ID
      this.projectId = data.data._id;

      return data.data;
    } catch (error) {
      console.error("获取项目信息失败:", error);
      throw error;
    }
  }

  /**
   * 获取项目的分类菜单（包含接口列表）
   * @param categoryIds - 可选的分类 ID 数组，用于过滤
   */
  async getCategoryMenu(categoryIds: number[] = []): Promise<CategoryMenuData[]> {
    // 确保已经获取了项目 ID
    if (!this.projectId) {
      await this.getProjectInfo();
    }

    const url = `${this.serverUrl}/api/interface/getCatMenu?token=${this.token}&project_id=${this.projectId}`;

    try {
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<CategoryMenuData[]>;

      if (data.errcode !== 0) {
        throw new Error(`获取分类菜单失败: ${data.errmsg}`);
      }

      let categories = data.data;

      // 如果指定了 categoryIds，则只返回这些分类
      if (categoryIds && categoryIds.length > 0) {
        categories = categories.filter((cat) => categoryIds.includes(cat._id));
        console.log(`已过滤分类，只保留 ${categories.length} 个指定的分类`);
      }

      return categories;
    } catch (error) {
      console.error("获取分类菜单失败:", error);
      throw error;
    }
  }

  /**
   * 获取单个接口的详细信息
   */
  async getInterfaceDetail(interfaceId: number): Promise<InterfaceInfo> {
    const url = `${this.serverUrl}/api/interface/get?token=${this.token}&id=${interfaceId}`;

    try {
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<InterfaceInfo>;

      if (data.errcode !== 0) {
        throw new Error(`获取接口详情失败: ${data.errmsg}`);
      }

      return data.data;
    } catch (error) {
      console.error(`获取接口 ${interfaceId} 详情失败:`, error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategoryList(): Promise<CategoryMenuData[]> {
    const url = `${this.serverUrl}/api/interface/list_cat?token=${this.token}&project_id=${this.projectId}`;

    try {
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<CategoryMenuData[]>;

      if (data.errcode !== 0) {
        throw new Error(`获取分类列表失败: ${data.errmsg}`);
      }

      return data.data;
    } catch (error) {
      console.error("获取分类列表失败:", error);
      throw error;
    }
  }

  /**
   * 获取某个分类下的所有接口列表
   */
  async getInterfaceListByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 100
  ): Promise<InterfaceListData> {
    const url = `${this.serverUrl}/api/interface/list?token=${this.token}&catid=${categoryId}&page=${page}&limit=${limit}`;

    try {
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<InterfaceListData>;

      if (data.errcode !== 0) {
        throw new Error(`获取接口列表失败: ${data.errmsg}`);
      }

      return data.data;
    } catch (error) {
      console.error(`获取分类 ${categoryId} 的接口列表失败:`, error);
      throw error;
    }
  }

  /**
   * 获取项目所有接口的完整数据（推荐使用此方法）
   * 返回格式符合 core 库的 CategoryList 类型
   */
  async getAllInterfacesWithDetails(): Promise<Category[]> {
    try {
      // 1. 获取项目信息
      console.log("正在获取项目信息...");
      const projectInfo = await this.getProjectInfo();
      console.log(`项目名称: ${projectInfo.name}`);
      console.log(`项目 ID: ${projectInfo._id}`);

      // 2. 获取分类菜单（支持过滤）
      console.log("正在获取分类菜单...");
      const categoryMenu = await this.getCategoryMenu(this.categoryIds);
      console.log(`共 ${categoryMenu.length} 个分类`);

      // 3. 创建分类映射
      const categoryMap = new Map<number, Category>();
      for (const category of categoryMenu) {
        categoryMap.set(category._id, {
          _id: category._id,
          _url: `${this.serverUrl}/project/${this.projectId}/interface/api/cat_${category._id}`,
          name: category.name,
          desc: category.desc || "",
          list: [],
          add_time: category.add_time,
          up_time: category.up_time,
        });
      }

      // 4. 获取项目的所有接口列表（简要信息）
      console.log("\n正在获取项目接口列表...");
      const url = `${this.serverUrl}/api/interface/list?token=${this.token}&project_id=${this.projectId}&page=1&limit=10000`;
      const res = await fetch(url);
      const data = (await res.json()) as YApiResponse<InterfaceListData>;

      if (data.errcode !== 0) {
        throw new Error(`获取接口列表失败: ${data.errmsg}`);
      }

      const interfaceList = data.data?.list || [];
      console.log(`共 ${interfaceList.length} 个接口`);

      // 5. 为每个接口获取详细信息并分类
      for (let i = 0; i < interfaceList.length; i++) {
        const simpleInterface = interfaceList[i];
        const category = categoryMap.get(simpleInterface.catid);

        if (!category) {
          console.warn(
            `  接口 ${simpleInterface.title} 的分类 ${simpleInterface.catid} 不存在，跳过`
          );
          continue;
        }

        console.log(
          `\n处理接口 ${i + 1}/${interfaceList.length}: ${
            simpleInterface.title
          } (${category.name})`
        );

        try {
          // 获取接口详细信息
          const interfaceDetail = await this.getInterfaceDetail(
            simpleInterface._id
          );

          // 添加额外的元信息
          interfaceDetail._category = {
            _id: category._id,
            _url: category._url,
            name: category.name,
            desc: category.desc,
            add_time: category.add_time,
            up_time: category.up_time,
          };

          interfaceDetail._project = {
            _id: projectInfo._id,
            _url: `${this.serverUrl}/project/${projectInfo._id}/interface/api`,
            name: projectInfo.name,
            desc: projectInfo.desc || "",
            basepath: projectInfo.basepath || "",
            tag: projectInfo.tag || [],
            env: projectInfo.env || [],
          };

          interfaceDetail._url = `${this.serverUrl}/project/${this.projectId}/interface/api/${interfaceDetail._id}`;

          category.list.push(interfaceDetail);

          // 避免请求过快，适当延迟
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error(
            `  获取接口 ${simpleInterface.title} 详情失败:`,
            (error as Error).message
          );
          // 继续处理下一个接口
        }
      }

      // 6. 转换为数组
      const categoryList = Array.from(categoryMap.values());

      console.log("\n✅ 所有接口数据获取完成");
      console.log(
        `共 ${categoryList.length} 个分类，${categoryList.reduce(
          (sum, cat) => sum + cat.list.length,
          0
        )} 个接口`
      );

      return categoryList;
    } catch (error) {
      console.error("获取所有接口数据失败:", error);
      throw error;
    }
  }
}

