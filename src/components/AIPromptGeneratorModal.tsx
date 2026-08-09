import React, { useState } from 'react';
import { Sparkles, X, Wand2, Copy, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AIPromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPromptGeneratorModal: React.FC<AIPromptGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [role, setRole] = useState('');
  const [task, setTask] = useState('');
  const [context, setContext] = useState('');
  const [goal, setGoal] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedPrompt(null);

    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          task,
          context,
          goal,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при генерации промпта');
      }

      setGeneratedPrompt(data.prompt);
    } catch (err: any) {
      console.error('Error generating prompt:', err);
      setError(err.message || 'Не удалось сгенерировать промпт. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyGenerated = async () => {
    if (!generatedPrompt) return;
    try {
      const fullText = generatedPrompt.fullPromptText || `
[РОЛЬ]: ${generatedPrompt.role}
[ЗАДАЧА]: ${generatedPrompt.task}
[КОНТЕКСТ]: ${generatedPrompt.context}
[ФОРМАТ]: ${generatedPrompt.format}
[ОГРАНИЧЕНИЯ]: ${generatedPrompt.constraints}
      `.trim();

      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy generated prompt:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-fadeIn my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI-Генератор кастомных промптов</h2>
            <p className="text-xs text-slate-400">Сгенерируйте промпт по формуле под вашу уникальную карьерную ситуацию</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Желаемая роль ИИ
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Например: Senior Copywriter / Head of Growth"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Основная задача
              </label>
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Например: Написать продающий пост для Telegram / Reels сценарий"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Ваш контекст / продукт
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Опишите продукт, целевую аудиторию, ключевое УТП и желаемое действие..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Генерируем с помощью Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Сгенерировать индивидуальный промпт</span>
              </>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 mb-4">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result Container */}
        {generatedPrompt && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Сгенерированный промпт: {generatedPrompt.title}
              </span>
              <button
                onClick={handleCopyGenerated}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                  copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <strong className="text-emerald-400">Для кого: </strong>
              {generatedPrompt.targetAudience}
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto">
              {generatedPrompt.fullPromptText || `
[РОЛЬ]: ${generatedPrompt.role}
[ЗАДАЧА]: ${generatedPrompt.task}
[КОНТЕКСТ]: ${generatedPrompt.context}
[ФОРМАТ]: ${generatedPrompt.format}
[ОГРАНИЧЕНИЯ]: ${generatedPrompt.constraints}
              `.trim()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
