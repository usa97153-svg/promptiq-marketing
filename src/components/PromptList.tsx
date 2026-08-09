import React, { useState, useMemo } from 'react';
import { PROMPTS_DATA, CATEGORIES, AIPromptItem } from '../data/promptsData';
import { PromptCard } from './PromptCard';
import { 
  Search, 
  Bookmark, 
  ListOrdered, 
  LayoutGrid, 
  Filter, 
  X, 
  ArrowLeft,
  Sparkles,
  Compass,
  Check,
  Copy
} from 'lucide-react';

interface PromptListProps {
  initialCategoryId?: number | null;
  onBackToHome: () => void;
  onOpenGenerator: () => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}

export const PromptList: React.FC<PromptListProps> = ({
  initialCategoryId = null,
  onBackToHome,
  onOpenGenerator,
  favorites,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'compactList'>('cards');
  const [jumpToNumber, setJumpToNumber] = useState<string>('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Filter prompts logic
  const filteredPrompts = useMemo(() => {
    return PROMPTS_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== null && item.categoryId !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showOnlyFavorites && !favorites.includes(item.id)) {
        return false;
      }
      // Jump to number search
      if (jumpToNumber && jumpToNumber.trim() !== '') {
        const num = parseInt(jumpToNumber.trim(), 10);
        if (!isNaN(num) && item.id !== num) {
          return false;
        }
      }
      // Text search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesText = item.fullPromptText.toLowerCase().includes(q);
        const matchesTarget = item.targetAudience.toLowerCase().includes(q);
        const matchesRole = item.formula.role.toLowerCase().includes(q);
        const matchesNumber = item.id.toString() === q;
        return matchesTitle || matchesText || matchesTarget || matchesRole || matchesNumber;
      }
      return true;
    });
  }, [selectedCategory, searchQuery, showOnlyFavorites, favorites, jumpToNumber]);

  const handleCopyText = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans pb-16">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-[#070d1e]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center space-x-2 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Главная страница</span>
            </button>

            <div className="md:hidden flex items-center space-x-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                50 промптов
              </span>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 md:pb-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                  viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Карточный вид"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Карточки</span>
              </button>
              <button
                onClick={() => setViewMode('compactList')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 cursor-pointer transition-colors ${
                  viewMode === 'compactList' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Нумерованный список"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Список 1-50</span>
              </button>
            </div>

            {/* Favorite Filter Toggle */}
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Избранные ({favorites.length})</span>
            </button>

            {/* AI Generator Button */}
            <button
              onClick={onOpenGenerator}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm shadow-blue-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Генератор</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Search & Category Header */}
        <div className="mb-8 space-y-4">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию, роли, навыкам или номеру промпта..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Jump to Specific Prompt Number (#1..#50) */}
            <div className="w-full sm:w-44 flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-medium shrink-0">Перейти к #:</span>
              <select
                value={jumpToNumber}
                onChange={(e) => setJumpToNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Все (1-50)</option>
                {PROMPTS_DATA.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.id} — {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Categories Selector Horizontal Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Все категории (50)
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-slate-800'
                }`}
              >
                {cat.id}. {cat.name}
              </button>
            ))}
          </div>

          {/* Active Filters Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <div className="flex items-center space-x-2">
              <span>Найдено промптов: <strong className="text-blue-400">{filteredPrompts.length}</strong> из 50</span>
              {selectedCategory && (
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Категория {selectedCategory}
                </span>
              )}
            </div>

            {(selectedCategory !== null || searchQuery || showOnlyFavorites || jumpToNumber) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setShowOnlyFavorites(false);
                  setJumpToNumber('');
                }}
                className="text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>Сбросить фильтры</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredPrompts.length === 0 && (
          <div className="text-center py-16 p-8 rounded-2xl bg-slate-900/60 border border-slate-800 max-w-md mx-auto">
            <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Промпты не найдены</h3>
            <p className="text-xs text-slate-400 mb-4">
              По вашему запросу ни одного промпта из 50 не обнаружено. Попробуйте изменить параметры поиска.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setShowOnlyFavorites(false);
                setJumpToNumber('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
            >
              Сбросить все фильтры
            </button>
          </div>
        )}

        {/* Cards View Mode */}
        {viewMode === 'cards' && filteredPrompts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((item) => (
              <PromptCard
                key={item.id}
                prompt={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* Compact Numbered List View Mode (#1 to #50) */}
        {viewMode === 'compactList' && filteredPrompts.length > 0 && (
          <div className="space-y-4">
            {filteredPrompts.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600/20 text-blue-400 font-mono font-bold text-xs border border-blue-500/30">
                      #{item.id}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                      {item.categoryName}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-400">
                    <strong className="text-emerald-400">Для кого: </strong>
                    {item.targetAudience}
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap border border-slate-800">
                    {item.fullPromptText}
                  </div>
                </div>

                <div className="flex md:flex-col items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyText(item.id, item.fullPromptText)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Копировать</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      favorites.includes(item.id)
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
