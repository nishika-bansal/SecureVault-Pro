import { KeyRound, LockKeyhole, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordGenerator from './PasswordGenerator.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import VaultManager from './VaultManager.jsx';

const views = [
  { id: 'vault', label: 'Vault', icon: LockKeyhole },
  { id: 'generator', label: 'Generator', icon: KeyRound }
];

export default function Dashboard({ theme, setTheme }) {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('vault');
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState('');

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  };

  const ActivePanel = {
    vault: <VaultManager onToast={notify} />,
    generator: <PasswordGenerator onToast={notify} />
  }[activeView];

  const nav = (
    <nav className="space-y-1">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition ${
            activeView === id
              ? 'bg-emerald-600 text-white'
              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
          }`}
          key={id}
          type="button"
          onClick={() => {
            setActiveView(id);
            setMenuOpen(false);
          }}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-soft dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          {toast}
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 lg:block">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-600 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-bold">SecureVault Pro</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Protected JWT session</p>
          </div>
        </div>
        {nav}
        <div className="absolute bottom-4 left-4 right-4 space-y-3">
          <div className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <p className="font-semibold">{user.name}</p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
          </div>
          <button className="btn-secondary w-full" type="button" onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/40 lg:hidden">
          <div className="h-full w-80 max-w-[86vw] bg-white p-4 dark:bg-zinc-900">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
                  <ShieldCheck size={22} />
                </div>
                <span className="font-bold">SecureVault Pro</span>
              </div>
              <button className="icon-btn" type="button" title="Close menu" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <section className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button className="icon-btn lg:hidden" type="button" title="Open menu" onClick={() => setMenuOpen(true)}>
                <Menu size={18} />
              </button>
              <div>
                <h1 className="text-xl font-bold">
                  {views.find((view) => view.id === activeView)?.label}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  AES encrypted vault with MongoDB storage
                </p>
              </div>
            </div>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-4 sm:p-6">{ActivePanel}</div>
      </section>
    </main>
  );
}
