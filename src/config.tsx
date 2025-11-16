import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import chromeStore from './tools/chromeStore';
import { ProxyRule } from './components/proxyPopup/RouteReplaceTool';
import { RedirectRule } from './components/proxyPopup/RedirectTool';
import { ScriptRule } from './components/proxyPopup/ScriptTool';
import { ProxyConfig, ProxyMode } from './components/proxyPopup/ProxyTool';

// 配置卡片组件
interface ConfigCardProps {
  title: string;
  icon: string;
  color: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ConfigCard: React.FC<ConfigCardProps> = ({
  title,
  icon,
  color,
  description,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div className='bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300'>
      <div
        className={`p-6 cursor-pointer hover:opacity-90 transition-opacity`}
        style={{ background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)` }}
        onClick={onToggle}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='text-4xl'>{icon}</div>
            <div>
              <h3 className='text-xl font-bold mb-1' style={{ color }}>{title}</h3>
              <p className='text-sm text-gray-600'>{description}</p>
            </div>
          </div>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className='p-6 border-t border-gray-100 animate-slideDown'>
          {children}
        </div>
      )}
    </div>
  );
};

// 路由替换配置组件
const ProxyConfig: React.FC<{ initialValue: ProxyRule[] }> = ({ initialValue }) => {
  const [rules, setRules] = useState<ProxyRule[]>(initialValue || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sourcePrefix: '',
    targetPrefix: '',
  });

  const saveRules = async (newRules: ProxyRule[]) => {
    await chromeStore.set('proxyConfig', newRules);
    setRules(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sourcePrefix || !formData.targetPrefix) return;

    if (editingId) {
      const updated = rules.map(r => r.id === editingId ? { ...r, ...formData, isGlobal: true, specificUrl: undefined } : r);
      await saveRules(updated);
      setEditingId(null);
    } else {
      const newRule: ProxyRule = {
        id: Date.now().toString(),
        ...formData,
        isGlobal: true,
        specificUrl: undefined,
        enabled: true,
      };
      await saveRules([...rules, newRule]);
    }
    
    setFormData({ sourcePrefix: '', targetPrefix: '' });
    setIsAdding(false);
  };

  const toggleEnabled = async (id: string) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    await saveRules(updated);
  };

  const deleteRule = async (id: string) => {
    await saveRules(rules.filter(r => r.id !== id));
  };

  const startEdit = (rule: ProxyRule) => {
    setFormData({
      sourcePrefix: rule.sourcePrefix,
      targetPrefix: rule.targetPrefix,
    });
    setEditingId(rule.id);
    setIsAdding(true);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4'>
        {rules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <button
                    onClick={() => toggleEnabled(rule.id)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className='space-y-1 text-sm'>
                  <div><span className='font-semibold text-gray-700'>源地址：</span><span className='text-gray-600'>{rule.sourcePrefix}</span></div>
                  <div><span className='font-semibold text-gray-700'>目标地址：</span><span className='text-gray-600'>{rule.targetPrefix}</span></div>
                </div>
              </div>
              <div className='flex gap-2'>
                <button onClick={() => startEdit(rule)} className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'>编辑</button>
                <button onClick={() => deleteRule(rule.id)} className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'>删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className='w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium'>
          + 添加新的路由规则
        </button>
      ) : (
        <form onSubmit={handleSubmit} className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg space-y-4'>
          <h4 className='font-bold text-lg text-gray-800'>{editingId ? '编辑规则' : '新增规则'}</h4>

          <input
            value={formData.sourcePrefix}
            onChange={(e) => setFormData({ ...formData, sourcePrefix: e.target.value })}
            placeholder='源地址前缀（如：https://api.example.com）'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required
          />

          <input
            value={formData.targetPrefix}
            onChange={(e) => setFormData({ ...formData, targetPrefix: e.target.value })}
            placeholder='目标地址前缀（如：http://localhost:3000）'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            required
          />

          <div className='flex gap-3'>
            <button type='submit' className='flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium'>保存</button>
            <button type='button' onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ sourcePrefix: '', targetPrefix: '' }); }} className='flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium'>取消</button>
          </div>
        </form>
      )}
    </div>
  );
};

// 脚本替换配置组件
const ScriptConfig: React.FC<{ initialValue: ScriptRule[] }> = ({ initialValue }) => {
  const [rules, setRules] = useState<ScriptRule[]>(initialValue || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    scriptUrl: '',
    replacementContent: '',
  });

  const saveRules = async (newRules: ScriptRule[]) => {
    await chromeStore.set('scriptConfig', newRules);
    setRules(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scriptUrl || !formData.replacementContent) return;

    if (editingId) {
      const updated = rules.map(r => r.id === editingId ? { ...r, ...formData, isGlobal: true, specificUrl: undefined } : r);
      await saveRules(updated);
      setEditingId(null);
    } else {
      const newRule: ScriptRule = {
        id: Date.now().toString(),
        ...formData,
        isGlobal: true,
        specificUrl: undefined,
        enabled: true,
      };
      await saveRules([...rules, newRule]);
    }
    
    setFormData({ scriptUrl: '', replacementContent: '' });
    setIsAdding(false);
  };

  const toggleEnabled = async (id: string) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    await saveRules(updated);
  };

  const deleteRule = async (id: string) => {
    await saveRules(rules.filter(r => r.id !== id));
  };

  const startEdit = (rule: ScriptRule) => {
    setFormData({
      scriptUrl: rule.scriptUrl,
      replacementContent: rule.replacementContent,
    });
    setEditingId(rule.id);
    setIsAdding(true);
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4'>
        {rules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <button
                    onClick={() => toggleEnabled(rule.id)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className='space-y-1 text-sm'>
                  <div><span className='font-semibold text-gray-700'>脚本URL：</span><span className='text-gray-600'>{rule.scriptUrl}</span></div>
                  <div><span className='font-semibold text-gray-700'>替换内容：</span><span className='text-gray-600 font-mono text-xs'>{rule.replacementContent.substring(0, 80)}{rule.replacementContent.length > 80 ? '...' : ''}</span></div>
                </div>
              </div>
              <div className='flex gap-2'>
                <button onClick={() => startEdit(rule)} className='px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600'>编辑</button>
                <button onClick={() => deleteRule(rule.id)} className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'>删除</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className='w-full py-3 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium'>
          + 添加脚本替换规则
        </button>
      ) : (
        <form onSubmit={handleSubmit} className='p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg space-y-4'>
          <h4 className='font-bold text-lg text-gray-800'>{editingId ? '编辑规则' : '新增规则'}</h4>

          <input
            value={formData.scriptUrl}
            onChange={(e) => setFormData({ ...formData, scriptUrl: e.target.value })}
            placeholder='需要替换的脚本URL（如：https://example.com/script.js）'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
            required
          />

          <textarea
            value={formData.replacementContent}
            onChange={(e) => setFormData({ ...formData, replacementContent: e.target.value })}
            placeholder='替换的JavaScript代码内容'
            rows={10}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm'
            required
          />

          <div className='flex gap-3'>
            <button type='submit' className='flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium'>保存</button>
            <button type='button' onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ scriptUrl: '', replacementContent: '' }); }} className='flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium'>取消</button>
          </div>
        </form>
      )}
    </div>
  );
};

// JS重定向配置组件
const RedirectConfig: React.FC<{ initialValue: RedirectRule[] }> = ({ initialValue }) => {
  const [rules, setRules] = useState<RedirectRule[]>(initialValue || []);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ codeUrl: '', redirectUrl: '' });

  const saveRules = async (newRules: RedirectRule[]) => {
    await chromeStore.set('codeConfig', newRules);
    setRules(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codeUrl || !formData.redirectUrl) return;

    const newRule: RedirectRule = {
      id: Date.now().toString(),
      ...formData,
      enabled: true,
    };
    await saveRules([...rules, newRule]);
    setFormData({ codeUrl: '', redirectUrl: '' });
    setIsAdding(false);
  };

  const toggleEnabled = async (id: string) => {
    const updated = rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    await saveRules(updated);
  };

  const deleteRule = async (id: string) => {
    await saveRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-4'>
        {rules.map((rule) => (
          <div key={rule.id} className={`p-4 rounded-lg border-2 transition-all ${rule.enabled ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <button
                    onClick={() => toggleEnabled(rule.id)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${rule.enabled ? 'bg-purple-500' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${rule.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className='space-y-1 text-sm'>
                  <div><span className='font-semibold text-gray-700'>源JS：</span><span className='text-gray-600'>{rule.codeUrl}</span></div>
                  <div><span className='font-semibold text-gray-700'>重定向至：</span><span className='text-gray-600'>{rule.redirectUrl}</span></div>
                </div>
              </div>
              <button onClick={() => deleteRule(rule.id)} className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'>删除</button>
            </div>
          </div>
        ))}
      </div>

      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className='w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium'>
          + 添加JS重定向规则
        </button>
      ) : (
        <form onSubmit={handleSubmit} className='p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg space-y-4'>
          <h4 className='font-bold text-lg text-gray-800'>新增重定向规则</h4>

          <input
            value={formData.codeUrl}
            onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })}
            placeholder='需要重定向的JS URL'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            required
          />

          <input
            value={formData.redirectUrl}
            onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
            placeholder='重定向到的URL'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            required
          />

          <div className='flex gap-3'>
            <button type='submit' className='flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium'>保存</button>
            <button type='button' onClick={() => { setIsAdding(false); setFormData({ codeUrl: '', redirectUrl: '' }); }} className='flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium'>取消</button>
          </div>
        </form>
      )}
    </div>
  );
};

// 代理服务器配置组件
const ProxyServerConfig: React.FC<{ initialValue: ProxyConfig | null }> = ({ initialValue }) => {
  const [config, setConfig] = useState<ProxyConfig>(
    initialValue || {
      mode: ProxyMode.DIRECT,
      rules: [],
    }
  );
  const [message, setMessage] = useState('');

  const getModeLabel = (mode: ProxyMode): string => {
    switch (mode) {
      case ProxyMode.SYSTEM:
        return '系统代理';
      case ProxyMode.DIRECT:
        return '直接连接';
      case ProxyMode.CUSTOM:
        return '自定义模式';
      default:
        return '';
    }
  };

  const handleModeChange = async (mode: ProxyMode) => {
    const newConfig = { ...config, mode };
    await chromeStore.set('proxyServerConfig', newConfig);
    setConfig(newConfig);
    setMessage('✅ 代理模式已更新');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleServerSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await chromeStore.set('proxyServerConfig', config);
    setMessage('✅ 代理服务器配置已保存');
    setTimeout(() => setMessage(''), 3000);
  };


  return (
    <div className='space-y-6'>
      {/* 模式选择 */}
      <div>
        <h4 className='font-semibold mb-3 text-gray-700'>代理模式</h4>
        <div className='grid grid-cols-3 gap-3'>
          {Object.values(ProxyMode).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                config.mode === mode
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className='font-medium text-sm'>{getModeLabel(mode)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 自定义模式配置 */}
      {config.mode === ProxyMode.CUSTOM && (
        <>
          <form onSubmit={handleServerSave} className='space-y-4 p-4 bg-indigo-50 rounded-lg'>
            <h4 className='font-semibold text-gray-700'>代理服务器设置</h4>
            
            <div className='text-sm text-gray-600 p-3 bg-yellow-50 border border-yellow-200 rounded'>
              💡 建议配合 <a href='https://github.com/avwo/whistle' target='_blank' rel='noopener noreferrer' className='text-indigo-600 underline hover:text-indigo-700'>whistle</a> 一起使用，whistle 是一个功能强大的跨平台网络调试工具
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>服务器地址</label>
              <input
                type='text'
                value={config.server?.host || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    server: {
                      host: e.target.value,
                      port: config.server?.port || 8080,
                    },
                  })
                }
                placeholder='例如: 127.0.0.1'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2 text-gray-700'>端口号</label>
              <input
                type='number'
                value={config.server?.port || 8080}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    server: {
                      host: config.server?.host || '',
                      port: parseInt(e.target.value) || 8080,
                    },
                  })
                }
                placeholder='例如: 8080'
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
              />
            </div>

            <button
              type='submit'
              className='w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium'
            >
              保存服务器配置
            </button>
          </form>
        </>
      )}

      {message && <div className='text-center text-sm font-medium'>{message}</div>}
    </div>
  );
};

// Cookie管理配置组件
const CookieConfig: React.FC<{ initialValue: any }> = ({ initialValue }) => {
  const [config, setConfig] = useState(initialValue || { sourceDomain: '', targetDomain: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleTransfer = async () => {
    if (!config.sourceDomain || !config.targetDomain) {
      setMessage('请填写源域名和目标域名');
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用CookieManager.transferCookies
      await chromeStore.set('cookieConfig', config);
      setMessage('✅ Cookie配置已保存');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ 保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <input
        value={config.sourceDomain}
        onChange={(e) => setConfig({ ...config, sourceDomain: e.target.value })}
        placeholder='源域名（如：example.com）'
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
      />

      <input
        value={config.targetDomain}
        onChange={(e) => setConfig({ ...config, targetDomain: e.target.value })}
        placeholder='目标域名（如：localhost:3000）'
        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
      />

      <button
        onClick={handleTransfer}
        disabled={loading}
        className='w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50'
      >
        {loading ? '处理中...' : '保存Cookie配置'}
      </button>

      {message && <div className='text-center text-sm font-medium'>{message}</div>}
    </div>
  );
};

// 主配置页面
const ConfigPage: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [proxyServerConfig, setProxyServerConfig] = useState<ProxyConfig | null>(null);
  const [proxyConfig, setProxyConfig] = useState<ProxyRule[]>([]);
  const [scriptConfig, setScriptConfig] = useState<ScriptRule[]>([]);
  const [redirectConfig, setRedirectConfig] = useState<RedirectRule[]>([]);
  const [cookieConfig, setCookieConfig] = useState<any>(null);

  useEffect(() => {
    // 加载代理服务器配置
    chromeStore.get('proxyServerConfig').then((data) => {
      if (data) {
        setProxyServerConfig(data);
      }
    });

    // 加载所有配置
    chromeStore.get('proxyConfig').then((data) => {
      if (data) {
        setProxyConfig(Array.isArray(data) ? data : [data]);
      }
    });

    chromeStore.get('scriptConfig').then((data) => {
      if (data) {
        // 兼容旧数据：如果是单个对象，转换为数组
        if (!Array.isArray(data)) {
          const legacyRule: ScriptRule = {
            id: Date.now().toString(),
            scriptUrl: data.scriptUrl,
            replacementContent: data.replacementContent,
            isGlobal: data.isGlobal,
            specificUrl: data.specificUrl,
            enabled: data.enabled ?? true,
          };
          setScriptConfig([legacyRule]);
        } else {
          setScriptConfig(data);
        }
      }
    });

    chromeStore.get('codeConfig').then((data) => {
      if (data) {
        setRedirectConfig(Array.isArray(data) ? data : [data]);
      }
    });

    chromeStore.get('cookieConfig').then((data) => {
      if (data) setCookieConfig(data);
    });
  }, []);

  const configs = [
    {
      id: 'proxyServer',
      title: '代理服务器',
      icon: '🚀',
      color: '#6366f1',
      description: '配置代理模式和代理服务器设置',
      component: <ProxyServerConfig initialValue={proxyServerConfig} />,
    },
    {
      id: 'proxy',
      title: '路由替换',
      icon: '🌐',
      color: '#3b82f6',
      description: '将特定URL请求代理到目标地址',
      component: <ProxyConfig initialValue={proxyConfig} />,
    },
    {
      id: 'script',
      title: '脚本替换',
      icon: '📝',
      color: '#10b981',
      description: '替换页面中的JavaScript文件内容',
      component: <ScriptConfig initialValue={scriptConfig} />,
    },
    {
      id: 'redirect',
      title: 'JS重定向',
      icon: '🔀',
      color: '#8b5cf6',
      description: '将JS文件请求重定向到其他地址',
      component: <RedirectConfig initialValue={redirectConfig} />,
    },
    {
      id: 'cookie',
      title: 'Cookie管理',
      icon: '🍪',
      color: '#f59e0b',
      description: '在不同域名之间复制Cookie信息',
      component: <CookieConfig initialValue={cookieConfig} />,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
      {/* 顶部导航栏 */}
      <div className='bg-white shadow-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-8 py-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Dev Proxy 配置中心（由AI生成）
              </h1>
              <p className='text-gray-500 mt-1'>管理你的开发代理工具配置</p>
            </div>
            <button
              onClick={() => {
                window.open(`chrome-extension://${chrome.runtime.id}/help.html`, '_blank');
              }}
              className='px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium'
            >
              📖 帮助文档
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className='max-w-7xl mx-auto px-8 py-8'>
        <div className='grid grid-cols-1 gap-6'>
          {configs.map((config) => (
            <ConfigCard
              key={config.id}
              title={config.title}
              icon={config.icon}
              color={config.color}
              description={config.description}
              isExpanded={expandedCard === config.id}
              onToggle={() => setExpandedCard(expandedCard === config.id ? null : config.id)}
            >
              {config.component}
            </ConfigCard>
          ))}
        </div>

        {/* 页脚提示 */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-sm text-gray-600'>
            <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            所有配置会自动保存，刷新页面即可生效
          </div>
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<ConfigPage />);

