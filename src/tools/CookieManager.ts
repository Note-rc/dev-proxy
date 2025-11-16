// src/tools/CookieManager.ts

interface CookieConfig {
  sourceDomain: string;
  targetDomain: string;
}

export default class CookieManager {
  static async transferCookies(config: CookieConfig): Promise<void> {
    console.log("🚀 ~ CookieManager ~ transferCookies ~ config:", config);
    try {
      // 获取源域名的所有cookie，config.sourceDomain可能用,隔开，要求获取所有域名的cookie
      const sourceDomains = config.sourceDomain.split(",");
      const cookies: chrome.cookies.Cookie[] = [];
      for await (const domain of sourceDomains) {
        const _cookies = await chrome.cookies.getAll({
          domain,
        });
        cookies.push(..._cookies);
      }

      // 将cookie设置到目标域名
      for (const cookie of cookies) {
        const newCookie = {
          ...cookie,
          url: `http://${config.targetDomain}`,
          domain: config.targetDomain.split(":")[0],
        };

        // 删除一些不需要的属性
        delete newCookie.hostOnly;
        delete newCookie.session;

        try {
          await chrome.cookies.set(newCookie);
        } catch (error) {
          console.error(`设置cookie失败: ${cookie.name}`, error);
        }
      }
    } catch (error) {
      console.error("转移cookie时发生错误:", error);
      throw error;
    }
  }
}
