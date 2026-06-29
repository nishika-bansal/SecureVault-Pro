import { Eye, EyeOff, Save, X } from 'lucide-react';
import { useState } from 'react';
import PasswordGenerator from './PasswordGenerator.jsx';
import StrengthMeter from './StrengthMeter.jsx';

export default function CredentialFormModal({ credential, onClose, onSave, onToast }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: credential?.title || '',
    username: credential?.username || '',
    url: credential?.url || '',
    password: credential?.password || '',
    category: credential?.category || 'Personal',
    favorite: Boolean(credential?.favorite)
  });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave(form);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zinc-950/50 p-4">
      <section className="panel w-full max-w-3xl">
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold">{credential ? 'Edit Credential' : 'Add Credential'}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Vault passwords are encrypted before storage.
            </p>
          </div>
          <button className="icon-btn" type="button" title="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="grid gap-4 p-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="label">Title</span>
              <input
                className="field"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                required
              />
            </label>
            <label className="space-y-1">
              <span className="label">Category</span>
              <input
                className="field"
                value={form.category}
                onChange={(event) => update('category', event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="label">Username</span>
              <input
                className="field"
                value={form.username}
                onChange={(event) => update('username', event.target.value)}
              />
            </label>
            <label className="space-y-1">
              <span className="label">URL</span>
              <input className="field" value={form.url} onChange={(event) => update('url', event.target.value)} />
            </label>
          </div>

          <label className="space-y-1">
            <span className="label">Password</span>
            <div className="flex gap-2">
              <input
                className="field font-mono"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                required
              />
              <button
                className="icon-btn"
                type="button"
                title={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <StrengthMeter password={form.password} />

          <button
            className="btn-secondary w-full"
            type="button"
            onClick={() => setShowGenerator((value) => !value)}
          >
            {showGenerator ? 'Hide Generator' : 'Open Generator'}
          </button>

          {showGenerator && (
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <PasswordGenerator
                compact
                onToast={onToast}
                onUsePassword={(password) => {
                  update('password', password);
                  setShowGenerator(false);
                }}
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              className="accent-emerald-600"
              type="checkbox"
              checked={form.favorite}
              onChange={(event) => update('favorite', event.target.checked)}
            />
            Mark as favorite
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:justify-end">
            <button className="btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" disabled={busy} type="submit">
              <Save size={18} />
              Save Credential
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
