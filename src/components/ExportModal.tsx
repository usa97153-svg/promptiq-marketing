import React, { useState } from 'react';
import { PROMPTS_DATA } from '../data/promptsData';
import { Download, Copy, Check, X, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateFullMarkdown = () => {
    let md = `# Пак из 50 профессиональных AI-промптов: Маркетинг и контент\n\n`;
    md += `*Сделано с помощью **PromptIQ***\n\n`;
    md += `**Формула промптов**: Роль + Задача + Контекст + Формат + Ограничения\n\n`;
    md += `---\n\n`;

    PROMPTS_DATA.forEach((item) => {
      md += `### ${item.id}. ${item.title}\n`;
      md += `**Категория**: ${item.categoryName}\n`;
      md += `**Для кого полезен**: ${item.targetAudience}\n\n`;
      md += `\`\`\`text\n${item.fullPromptText}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = async () => {
    try {
      const md = generateFullMarkdown();
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy markdown:', e);
    }
  };

  const handleDownloadMarkdown = () => {
    const md = generateFullMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PromptIQ_50_Marketing_and_Content_Prompts.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-fadeIn my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Экспорт 50 AI-промптов</h2>
            <p className="text-xs text-slate-400">Скопируйте или скачайте весь пак в формате Markdown</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-80 overflow-y-auto mb-6">
          {generateFullMarkdown().slice(0, 1500)}...
          <div className="text-blue-400 font-semibold mt-2">[+ Еще 45 промптов в итоговом файле]</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadMarkdown}
            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Скачать файл (.md)</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Все 50 промптов скопированы!' : 'Скопировать весь Markdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
