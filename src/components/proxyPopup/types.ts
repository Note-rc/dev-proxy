import { HeaderRule } from "./HeaderTool";
import { ProxyRule } from "./RouteReplaceTool";
import { ScriptRule } from "./ScriptTool";
import { RedirectRule } from "./RedirectTool";
import { ProxyConfig } from "./ProxyTool";

export interface Profile {
  id: string;
  name: string;
  enabled: boolean;
  headerConfig: HeaderRule[];
  proxyConfig: ProxyRule[];
  scriptConfig: ScriptRule[];
  codeConfig: RedirectRule[];
  proxyServerConfig: ProxyConfig | null;
}

export function createEmptyProfile(name: string): Profile {
  return {
    id: Date.now().toString(),
    name,
    enabled: true,
    headerConfig: [],
    proxyConfig: [],
    scriptConfig: [],
    codeConfig: [],
    proxyServerConfig: null,
  };
}
