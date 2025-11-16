// 存储配置信息

const devProxyConfig = JSON.parse(
  document.currentScript.getAttribute("data-config")
);

console.log(
  "🚀 ~ [拦截] 脚本拦截器已初始化，包含初始文档拦截功能",
  devProxyConfig
);

// 检查脚本URL是否需要替换
function shouldReplaceScript(src) {
  if (!devProxyConfig || !devProxyConfig.enabled || !src) return false;

  // 检查URL是否匹配
  if (!src.includes(devProxyConfig.scriptUrl)) return false;

  // 如果不是全局模式，检查当前页面URL是否匹配
  if (!devProxyConfig.isGlobal && devProxyConfig.specificUrl) {
    const currentUrl = location.href;
    if (!currentUrl.includes(devProxyConfig.specificUrl)) {
      return false;
    }
  }

  return true;
}

// 处理脚本替换
function processScript(script) {
  if (!script.src || !shouldReplaceScript(script.src)) return script;
  // 阻止原始脚本加载
  script.removeAttribute("src");
  // 设置替换内容
  script.text = devProxyConfig.replacementContent;
  console.log("🚀 ~ [拦截] 替换内容成功");
  return script;
}

// 劫持 document.createElement
const originalCreateElement = document.createElement;
document.createElement = function (tagName) {
  const element = originalCreateElement.apply(this, arguments);

  if (tagName.toLowerCase() === "script") {
    // 监听 src 属性设置
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function (name, value) {
      if (name === "src" && shouldReplaceScript(value)) {
        console.log("🚀 ~ [拦截] create", value);

        // 延迟执行，确保其他属性设置完成
        setTimeout(() => {
          this.removeAttribute("src");
          this.text = devProxyConfig.replacementContent;
        }, 0);

        return;
      }
      return originalSetAttribute.apply(this, arguments);
    };
  }

  return element;
};

// 劫持 appendChild
const originalAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function (node) {
  if (node.tagName === "SCRIPT" && node.src) {
    console.log("🚀 ~ [拦截] append :", node.src);
    if (shouldReplaceScript(node.src)) {
      processScript(node);
    }
  }
  return originalAppendChild.call(this, node);
};

// 劫持 insertBefore
const originalInsertBefore = Element.prototype.insertBefore;
Element.prototype.insertBefore = function (newNode, referenceNode) {
  if (newNode.tagName === "SCRIPT" && newNode.src) {
    console.log("🚀 ~ [拦截] insertBefore:", newNode.src);
    if (shouldReplaceScript(newNode.src)) {
      processScript(newNode);
    }
  }
  return originalInsertBefore.call(this, newNode, referenceNode);
};

// 劫持 script.src 访问器
const originalSrcDescriptor = Object.getOwnPropertyDescriptor(
  HTMLScriptElement.prototype,
  "src"
);

Object.defineProperty(HTMLScriptElement.prototype, "src", {
  set: function (value) {
    if (shouldReplaceScript(value)) {
      console.log("🚀 ~ [拦截] set src:", value);
      // 延迟执行，确保其他属性设置完成
      setTimeout(() => {
        this.removeAttribute("src");
        this.text = devProxyConfig.replacementContent;
      }, 0);

      return;
    }

    // 调用原始的 setter
    originalSrcDescriptor.set.call(this, value);
  },
  get: originalSrcDescriptor.get,
});

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      for (const node of Array.from(mutation.addedNodes)) {
        // 处理直接添加的 script 标签
        if (node.nodeName === "SCRIPT") {
          const script = node;
          if (script.src && shouldReplaceScript(script.src)) {
            console.log(
              "🚀 ~ [拦截] MutationObserver 发现目标脚本:",
              script.src
            );
            processScript(script);
          }
        }
        // 处理添加的 DOM 节点中包含的 script 标签
        else if (node.nodeType === 1) {
          const scripts = node.querySelectorAll("script[src]");
          scripts.forEach((script) => {
            if (shouldReplaceScript(script.src)) {
              console.log(
                "🚀 ~ [拦截] MutationObserver 发现嵌套脚本:",
                script.src
              );
              processScript(script);
            }
          });
        }
      }
    }
  }
});

// 开始观察整个文档
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// 处理页面上已存在的 script 标签
document.querySelectorAll("script[src]").forEach((script) => {
  if (shouldReplaceScript(script.src)) {
    console.log("🚀 ~ [拦截] 处理已存在的脚本:", script.src);
    processScript(script);
  }
});

// 拦截 XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (
  method,
  url,
  async = true,
  username,
  password
) {
  console.log("🚀 ~ 检测 url:", url);
  const urlString = url.toString();

  if (shouldReplaceScript(urlString)) {
    console.log("🚀 ~ [拦截] XHR 匹配目标:", urlString);

    // 保存原始的 onreadystatechange 处理程序
    const originalOnReadyStateChange = this.onreadystatechange;
    // 设置新的 onreadystatechange 处理程序
    this.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log("🚀 ~ [拦截] XMLHttpRequest 替换内容成功");
        // 替换响应文本
        Object.defineProperty(this, "responseText", {
          get: function () {
            return devProxyConfig.replacementContent;
          },
        });

        // 如果存在响应，也替换它
        if (this.response) {
          Object.defineProperty(this, "response", {
            get: function () {
              return devProxyConfig.replacementContent;
            },
          });
        }
      }

      // 调用原始的 onreadystatechange 处理程序
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.apply(this, arguments);
      }
    };
  }

  // 调用原始的 open 方法
  return originalXHROpen.call(this, method, url, async, username, password);
};
