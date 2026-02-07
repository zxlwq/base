
import React, { useState, useEffect } from 'react';
import * as base58 from './services/base58';
import { CopyIcon, CheckIcon, ClearIcon, GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const [encodeInput, setEncodeInput] = useState('');
  const [encodeOutput, setEncodeOutput] = useState('');
  
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeOutput, setDecodeOutput] = useState('');
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const [copiedSection, setCopiedSection] = useState<'encode' | 'decode' | null>(null);

  // Encoding Logic
  useEffect(() => {
    if (encodeInput) {
      try {
        setEncodeOutput(base58.encode(encodeInput));
      } catch (e) {
        setEncodeOutput('编码出错...');
      }
    } else {
      setEncodeOutput('');
    }
  }, [encodeInput]);

  // Decoding Logic
  useEffect(() => {
    if (decodeInput) {
      try {
        const decoded = base58.decode(decodeInput);
        setDecodeOutput(decoded);
        setDecodeError(null);
      } catch (e: any) {
        setDecodeOutput('');
        setDecodeError(e.message || '无效的 Base58 字符串');
      }
    } else {
      setDecodeOutput('');
      setDecodeError(null);
    }
  }, [decodeInput]);

  const copyToClipboard = async (text: string, section: 'encode' | 'decode') => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('无法复制!', err);
    }
  };

  const clearAll = () => {
    setEncodeInput('');
    setDecodeInput('');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="/images/favicon.ico" 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.parentElement!.className = "w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl";
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerText = "58";
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Base58</h1>
              <p className="text-xs text-slate-400 font-medium">在线base58编码解码工具</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={clearAll}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              title="清除所有内容"
            >
              <ClearIcon />
            </button>
            <a 
              href="https://github.com/zxlwq/base" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
              title="查看源代码"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Encoder */}
        <section className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              编码器
            </h2>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">文本 ➔ Base58</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <label className="text-sm text-slate-400 font-medium">输入 (纯文本)</label>
            </div>
            <textarea
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              placeholder="在此粘贴要编码的文本..."
              className="w-full h-48 p-4 bg-transparent outline-none resize-none mono text-sm leading-relaxed"
            />
            
            <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <label className="text-sm text-slate-400 font-medium">结果 (Base58)</label>
              <button 
                onClick={() => copyToClipboard(encodeOutput, 'encode')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  copiedSection === 'encode' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-transparent'
                }`}
              >
                {copiedSection === 'encode' ? <CheckIcon /> : <CopyIcon />}
                {copiedSection === 'encode' ? '已复制!' : '复制'}
              </button>
            </div>
            <div className="w-full h-48 p-4 bg-slate-950/50 overflow-auto break-all mono text-sm text-blue-400 whitespace-pre-wrap">
              {encodeOutput || <span className="text-slate-600 italic">编码结果将在此显示...</span>}
            </div>
          </div>
        </section>

        {/* Right: Decoder */}
        <section className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              解码器
            </h2>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Base58 ➔ 文本</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <label className="text-sm text-slate-400 font-medium">输入 (Base58 字符串)</label>
            </div>
            <textarea
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              placeholder="在此粘贴要解码的 Base58 字符串..."
              className={`w-full h-48 p-4 bg-transparent outline-none resize-none mono text-sm leading-relaxed ${decodeError ? 'text-red-400' : ''}`}
            />
            
            <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center">
              <label className="text-sm text-slate-400 font-medium">结果 (纯文本)</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(decodeOutput, 'decode')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copiedSection === 'decode' 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-transparent'
                  }`}
                >
                  {copiedSection === 'decode' ? <CheckIcon /> : <CopyIcon />}
                  {copiedSection === 'decode' ? '已复制!' : '复制'}
                </button>
              </div>
            </div>
            <div className="w-full h-48 p-4 bg-slate-950/50 overflow-auto break-words text-sm text-emerald-400 whitespace-pre-wrap">
              {decodeError ? (
                <div className="text-red-400 bg-red-400/5 p-2 rounded border border-red-400/20 text-xs">
                  {decodeError}
                </div>
              ) : (
                decodeOutput || <span className="text-slate-600 italic">解码结果将在此显示...</span>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-white">关于 Base58</h4>
            <p className="text-slate-400 leading-relaxed">
              Base58 是一种将大整数表示为字母数字文本的二进制转文本编码方案。
              它专为人眼可读性设计，避免了 0 (零)、O (大写 O)、I (大写 I) 和 l (小写 L) 等容易混淆的字符。
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">核心功能</h4>
            <ul className="text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                零依赖加密算法实现
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                比特币标准字母表支持
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                实时双向自动转换
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-white">开发者信息</h4>
            <p className="text-slate-400">
              基于 React、TypeScript 和 Tailwind CSS 构建。支持通过 GitHub 部署到 Cloudflare Pages。
            </p>
            <div className="flex gap-4">
              <span className="px-2 py-1 bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                v1.0.0 稳定版
              </span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Base58 在线工具. 开源项目.
        </div>
      </footer>
    </div>
  );
};

export default App;
