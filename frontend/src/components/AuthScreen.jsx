import { Eye, EyeOff, KeyRound, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function AuthScreen({ theme, setTheme }) {
  const { register, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const run = async (handler) => {
    setBusy(true);
    setError('');
    try {
      await handler();
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    run(() => login({ email: form.email, password: form.password }));
  };

  const handleRegister = (event) => {
    event.preventDefault();
    run(() =>
      register({
        name: form.name,
        email: form.email,
        password: form.password
      })
    );
  };

  const passwordInput = (
    <label className="space-y-1">
      <span className="label">Password</span>
      <div className="relative">
        <input
          className="field pr-11"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={(event) => update('password', event.target.value)}
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          required
        />
        <button
          className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          type="button"
          title={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((value) => !value)}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </label>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),transparent_34%),linear-gradient(135deg,#fafafa,#f4f4f5)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,#09090b,#18181b)]">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-600 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">SecureVault Pro</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Enterprise Password Manager</p>
            </div>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,440px)]">
          <section className="hidden lg:block">
            <div className="panel overflow-hidden">
              <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
                <span className="badge border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                  AES-256 encrypted vault
                </span>
              </div>
              <div className="grid gap-4 p-5">
                {[
                  ['Authentication', 'JWT sessions + bcrypt hashing'],
                  ['Vault Security', 'Protected REST APIs + encrypted passwords'],
                  ['Database Layer', 'MongoDB Atlas ready with Mongoose models']
                ].map(([label, value]) => (
                  <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800" key={label}>
                    <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
                    <p className="mt-2 text-lg font-bold">{value}</p>
                  </div>
                ))}
                <div className="rounded-lg bg-zinc-950 p-4 font-mono text-xs text-emerald-300">
                  <p>{'>'} bcrypt.hash(accountPassword)</p>
                  <p className="mt-2 text-zinc-400">{'>'} aes256.encrypt(vaultPassword)</p>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <div className="mb-5 flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              {[
                ['login', 'Login'],
                ['register', 'Register']
              ].map(([key, label]) => (
                <button
                  className={`min-h-10 flex-1 rounded-lg text-sm font-semibold transition ${
                    mode === key
                      ? 'bg-white text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-white'
                      : 'text-zinc-500'
                  }`}
                  key={key}
                  type="button"
                  onClick={() => {
                    setMode(key);
                    setError('');
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300">
                {error}
              </div>
            )}

            {mode === 'login' && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <label className="space-y-1">
                  <span className="label">Email</span>
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
                {passwordInput}
                <button className="btn-primary w-full" disabled={busy} type="submit">
                  <KeyRound size={18} />
                  Login
                </button>
              </form>
            )}

            {mode === 'register' && (
              <form className="space-y-4" onSubmit={handleRegister}>
                <label className="space-y-1">
                  <span className="label">Name</span>
                  <input
                    className="field"
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="space-y-1">
                  <span className="label">Email</span>
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
                {passwordInput}
                <button className="btn-primary w-full" disabled={busy} type="submit">
                  <UserPlus size={18} />
                  Create Account
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
