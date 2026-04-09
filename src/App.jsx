import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Play, Gamepad2, ArrowLeft, ExternalLink, Moon, Sun, Settings } from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [showSettings, setShowSettings] = useState(false);
  const [autoCloak, setAutoCloak] = useState(() => {
    return localStorage.getItem('autoCloak') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('autoCloak', autoCloak);
  }, [autoCloak]);

  const cloak = () => {
    const url = window.location.href;
    const win = window.open('about:blank', '_blank');
    if (!win) {
      alert('Please allow popups for cloaking to work!');
      return;
    }
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = url;
    win.document.body.appendChild(iframe);
    window.location.replace('https://google.com');
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setSelectedGame(null)}
          >
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Shrcade
            </h1>
          </div>

          <div className="flex-1 max-w-xl hidden md:block relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-input w-full pl-12 pr-4 py-2.5"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-main)]"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-main)]"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="mt-4 md:hidden relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="modern-input w-full pl-12 pr-4 py-2.5"
          />
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="modern-card w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-[var(--bg-main)] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Dark Mode</p>
                    <p className="text-sm text-[var(--text-muted)]">Toggle between light and dark themes</p>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Auto-Cloak on Entry</p>
                    <p className="text-sm text-[var(--text-muted)]">Automatically open in about:blank tab</p>
                  </div>
                  <button
                    onClick={() => setAutoCloak(!autoCloak)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${autoCloak ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoCloak ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <button
                    onClick={cloak}
                    className="w-full py-2 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Cloak Now
                  </button>
                </div>
                
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold mb-2">About Shrcade</p>
                  <p className="text-sm">A modern, unblocked gaming platform built for speed and simplicity.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  whileHover={{ y: -4 }}
                  className="modern-card group cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white text-black px-6 py-2 rounded-full font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Play Now
                      </div>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-[var(--bg-card)] inline-block p-6 rounded-3xl border border-[var(--border-color)]">
                    <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)] opacity-20" />
                    <h2 className="text-xl font-bold text-[var(--text-muted)]">
                      No games found matching your search
                    </h2>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 bg-[var(--bg-main)] flex flex-col"
            >
              <div className="bg-[var(--bg-card)] px-6 py-3 flex items-center justify-between border-b border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-[var(--bg-main)] rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h2 className="font-bold leading-tight">{selectedGame.title}</h2>
                    <p className="text-xs text-[var(--text-muted)]">Playing on Shrcade</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={selectedGame.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 hover:bg-[var(--bg-main)] rounded-xl transition-colors text-[var(--text-muted)] hover:text-primary"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern Footer */}
      <footer className="bg-[var(--bg-card)] border-t border-[var(--border-color)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Shrcade
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            © 2026 Shrcade • All games unblocked and free to play.
          </p>
          <div className="flex gap-8">
            {['Twitter', 'Discord', 'Github'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
