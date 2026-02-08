import { useStore } from '../stores/useStore';
import {
  LayoutDashboard, Users, BookOpen, PenLine, FileText,
  Settings, Moon, Sun, Menu, X, Download, Upload
} from 'lucide-react';
import { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { ToastContainer } from './ToastNotification';

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'students', label: 'Élèves', icon: Users },
  { id: 'subjects', label: 'Matières', icon: BookOpen },
  { id: 'grades', label: 'Saisie des Notes', icon: PenLine },
  { id: 'bulletins', label: 'Bulletins', icon: FileText },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setPage, darkMode, toggleDarkMode, settings, exportAllData, importAllData } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    saveAs(blob, `bulles-de-joie-backup-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) importAllData(ev.target.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-rose-pale text-gray-800'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-40 flex h-full w-64 flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: darkMode
            ? 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(180deg, #FF69B4 0%, #C71585 100%)',
        }}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-10 w-10 rounded-full object-cover shadow-lg" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl shadow-lg">
              🫧
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-white" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Les Bulles de Joie
            </h2>
            <p className="text-[10px] text-white/60">{settings.anneeScolaire}</p>
          </div>
          <button className="ml-auto text-white/60 md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-white/25 text-white shadow-lg shadow-white/10'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-2 border-t border-white/10 p-3">
          <button onClick={handleExport} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white">
            <Download size={14} /> Exporter données
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white">
            <Upload size={14} /> Importer données
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`flex items-center gap-4 border-b px-4 py-3 ${darkMode ? 'border-gray-700 bg-gray-800/80' : 'border-rose-clair/30 bg-white/80'} backdrop-blur-md`}>
          <button className="rounded-lg p-1.5 hover:bg-gray-200/50 md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h1 className="flex-1 text-lg font-bold">
            {navItems.find((n) => n.id === currentPage)?.label}
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`rounded-xl p-2 transition-colors ${darkMode ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Professional Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
