import { Copy, KeyRound, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { generatePassword } from '../lib/password.js';
import StrengthMeter from './StrengthMeter.jsx';

const defaultOptions = {
  length: 18,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true
};

export default function PasswordGenerator({ compact = false, onUsePassword, onToast }) {
  const [options, setOptions] = useState(defaultOptions);
  const [password, setPassword] = useState(() => generatePassword(defaultOptions));

  const refresh = () => setPassword(generatePassword(options));

  useEffect(() => {
    refresh();
  }, [options.length, options.uppercase, options.lowercase, options.numbers, options.symbols]);

  const toggle = (key) => {
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    onToast?.('Generated password copied');
  };

  return (
    <section className={compact ? 'space-y-4' : 'panel p-5'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Password Generator</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Create high-entropy passwords for new vault items.
          </p>
        </div>
        <button className="icon-btn" type="button" title="Generate password" onClick={refresh}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <KeyRound className="shrink-0 text-emerald-600" size={18} />
          <input className="field font-mono" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="icon-btn" type="button" title="Copy generated password" onClick={copy}>
            <Copy size={18} />
          </button>
        </div>
      </div>

      <StrengthMeter password={password} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="label">Length</span>
          <input
            className="w-full accent-emerald-600"
            type="range"
            min="10"
            max="36"
            value={options.length}
            onChange={(event) =>
              setOptions((current) => ({ ...current, length: Number(event.target.value) }))
            }
          />
          <span className="text-sm font-semibold">{options.length} characters</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['uppercase', 'Uppercase'],
            ['lowercase', 'Lowercase'],
            ['numbers', 'Numbers'],
            ['symbols', 'Symbols']
          ].map(([key, label]) => (
            <label
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
              key={key}
            >
              <input
                className="accent-emerald-600"
                type="checkbox"
                checked={options[key]}
                onChange={() => toggle(key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {onUsePassword && (
        <button className="btn-primary w-full" type="button" onClick={() => onUsePassword(password)}>
          Use Generated Password
        </button>
      )}
    </section>
  );
}
