import React, { useState } from 'react';
import { AIPromptItem } from '../data/promptsData';
import { 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Sparkles,
  Layers,
  RotateCcw
} from 'lucide-react';

interface PromptCardProps {
  prompt: AIPromptItem;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [showVariablesFiller, setShowVariablesFiller] = useState(false);

  // Dynamic variable replacement state
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Calculate current prompt text with variables applied
  const getProcessedPromptText = () => {
    let result = prompt.fullPromptText;
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        const val = variableValues[v];
        if (val && val.trim() !== '') {
          // Replace both [v] and literal v
          result = result.split(`[${v}]`).join(val);
        }
      });
    }
    return result;
  };

  const handleCopy = async () => {
    try {
      const textToCopy = getProcessedPromptText();
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleVariableChange = (varName: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [varName]: value }));
  };

  const handleResetVariables = () => {
    setVariableValues({});
  };

  const processedText = getProcessedPromptText();
  const hasActiveVariables = Object.values(variableValues).some((v) => typeof v === 'string' && v.trim() !== '');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl transition-all hover:border-slate-700 flex flex-col justify-between group">
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2.5">
            {/* Number Tag */}
            <span className="px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 font-mono font-bold text-sm border border-blue-500/30">
              #{prompt.id}
            </span>
            {/* Category Tag */}
            <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700/60 truncate max-w-[200px] sm:max-w-xs">
              {prompt.categoryName}
            </span>
          </div>

          {/* Action Buttons: Favorite & Formula Toggle */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {isFavorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title (3-5 words) */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
          {prompt.title}
        </h3>

        {/* Target Audience (Для кого полезен) */}
        <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-2.5">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">Для кого полезен: </span>
            {prompt.targetAudience}
          </div>
        </div>

        {/* Formula Component Collapsible Breakdown */}
        <div className="mb-4">
          <button
            onClick={() => setShowFormula(!showFormula)}
            className="w-full py-2 px-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 font-medium flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Формула 5 элементов (Роль, Задача, Контекст...)</span>
            </div>
            {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFormula && (
            <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300 animate-fadeIn">
              <div>
                <span className="font-bold text-blue-400">Роль: </span>
                <span>{prompt.formula.role}</span>
              </div>
              <div>
                <span className="font-bold text-indigo-400">Задача: </span>
                <span>{prompt.formula.task}</span>
              </div>
              <div>
                <span className="font-bold text-sky-400">Контекст: </span>
                <span>{prompt.formula.context}</span>
              </div>
              <div>
                <span className="font-bold text-teal-400">Формат: </span>
                <span>{prompt.formula.format}</span>
              </div>
              <div>
                <span className="font-bold text-emerald-400">Ограничения: </span>
                <span>{prompt.formula.constraints}</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Variable Filler Toggle */}
        {prompt.variables && prompt.variables.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowVariablesFiller(!showVariablesFiller)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-all cursor-pointer border ${
                hasActiveVariables
                  ? 'bg-blue-900/40 text-blue-200 border-blue-500/50'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Заполнить данные переменные ({prompt.variables.length})
                  {hasActiveVariables && ' • [Заполнено]'}
                </span>
              </div>
              {showVariablesFiller ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showVariablesFiller && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Введите ваши значения для скобок:</span>
                  {hasActiveVariables && (
                    <button
                      onClick={handleResetVariables}
                      className="text-slate-400 hover:text-rose-400 flex items-center space-x-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Сброс</span>
                    </button>
                  )}
                </div>

                {prompt.variables.map((v, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 block">
                      [{v}]
                    </label>
                    <input
                      type="text"
                      value={variableValues[v] || ''}
                      onChange={(e) => handleVariableChange(v, e.target.value)}
                      placeholder={`Ваше значение для ${v}...`}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Full Prompt Display Box */}
        <div className="relative mb-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto selection:bg-blue-600 selection:text-white">
            {processedText}
          </div>
        </div>
      </div>

      {/* Card Footer: Copy Prompt Button */}
      <div className="pt-2">
        <button
          onClick={handleCopy}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Скопировано в буфер!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white" />
              <span>Скопировать промпт</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
