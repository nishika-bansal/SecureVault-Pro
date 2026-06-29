import {
  Copy,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  Globe,
  LockKeyhole,
  Plus,
  Search,
  Star,
  Trash2
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { strengthLabel } from '../lib/password.js';
import CredentialFormModal from './CredentialFormModal.jsx';
import StrengthMeter from './StrengthMeter.jsx';

export default function VaultManager({ onToast }) {
  const { authFetch } = useAuth();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCredentials = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category !== 'All') params.set('category', category);
    if (favoriteOnly) params.set('favorite', 'true');

    const data = await authFetch(`/credentials?${params.toString()}`);
    setCredentials(data.credentials);
    setLoading(false);
  }, [authFetch, category, favoriteOnly, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadCredentials().catch((error) => {
        setLoading(false);
        onToast?.(error.message);
      });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [loadCredentials, onToast]);

  const categories = useMemo(() => {
    const values = new Set(credentials.map((credential) => credential.category).filter(Boolean));
    return ['All', ...values];
  }, [credentials]);

  const saveCredential = async (payload) => {
    if (editing) {
      await authFetch(`/credentials/${editing.id}`, { method: 'PATCH', body: payload });
      onToast?.('Credential updated');
    } else {
      await authFetch('/credentials', { method: 'POST', body: payload });
      onToast?.('Credential added');
    }

    setModalOpen(false);
    setEditing(null);
    await loadCredentials();
  };

  const deleteCredential = async (credential) => {
    if (!window.confirm(`Delete ${credential.title}?`)) return;
    await authFetch(`/credentials/${credential.id}`, { method: 'DELETE' });
    onToast?.('Credential deleted');
    await loadCredentials();
  };

  const copyPassword = async (credential) => {
    const data = await authFetch(`/credentials/${credential.id}/reveal`, { method: 'POST' });
    await navigator.clipboard.writeText(data.password);
    onToast?.('Password copied');
  };

  return (
    <div className="space-y-5">
      <section className="panel p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Encrypted Vault</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {credentials.length} credential{credentials.length === 1 ? '' : 's'} in the current view
            </p>
          </div>
          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <Plus size={18} />
            Add Credential
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              className="field pl-10"
              placeholder="Search title, username, URL, or category"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <label className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <select className="field pl-10" value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm font-semibold dark:border-zinc-700">
            <input
              className="accent-emerald-600"
              type="checkbox"
              checked={favoriteOnly}
              onChange={(event) => setFavoriteOnly(event.target.checked)}
            />
            Favorites
          </label>
        </div>
      </section>

      {loading ? (
        <div className="panel p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Loading credentials
        </div>
      ) : credentials.length === 0 ? (
        <div className="panel p-8 text-center">
          <LockKeyholeIcon />
          <h3 className="mt-3 text-lg font-semibold">No credentials found</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Add your first login or adjust the current filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {credentials.map((credential) => {
            const visible = visiblePasswords[credential.id];

            return (
              <article className="panel p-4" key={credential.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold">{credential.title}</h3>
                      {credential.favorite && <Star className="fill-amber-400 text-amber-400" size={17} />}
                      <span className="badge">{credential.category || 'General'}</span>
                    </div>
                    <div className="mt-1 flex min-w-0 items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Globe size={15} />
                      <span className="truncate">{credential.url || 'No URL saved'}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      className="icon-btn"
                      type="button"
                      title="Edit credential"
                      onClick={() => {
                        setEditing(credential);
                        setModalOpen(true);
                      }}
                    >
                      <Edit3 size={17} />
                    </button>
                    <button
                      className="icon-btn"
                      type="button"
                      title="Delete credential"
                      onClick={() => deleteCredential(credential)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div>
                    <p className="label">Username</p>
                    <p className="mt-1 truncate text-sm font-medium">{credential.username || 'Not saved'}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="flex items-center gap-2">
                    <input
                      className="field font-mono"
                      readOnly
                      type={visible ? 'text' : 'password'}
                      value={credential.password}
                    />
                    <button
                      className="icon-btn"
                      type="button"
                      title={visible ? 'Hide password' : 'Show password'}
                      onClick={() =>
                        setVisiblePasswords((current) => ({
                          ...current,
                          [credential.id]: !current[credential.id]
                        }))
                      }
                    >
                      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                    <button
                      className="icon-btn"
                      type="button"
                      title="Copy password"
                      onClick={() => copyPassword(credential)}
                    >
                      <Copy size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <StrengthMeter score={credential.strengthScore} />
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Stored as {strengthLabel(credential.strengthScore).toLowerCase()} password strength
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <CredentialFormModal
          credential={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSave={saveCredential}
          onToast={onToast}
        />
      )}
    </div>
  );
}

function LockKeyholeIcon() {
  return (
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
      <LockKeyhole size={24} />
    </div>
  );
}
