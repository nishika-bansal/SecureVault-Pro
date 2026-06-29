import { scorePassword, strengthColor, strengthLabel } from '../lib/password.js';

export default function StrengthMeter({ password = '', score }) {
  const computedScore = score ?? scorePassword(password);
  const width = `${Math.max(10, (computedScore + 1) * 20)}%`;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-zinc-500 dark:text-zinc-400">Password strength</span>
        <span className="font-semibold">{strengthLabel(computedScore)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className={`h-full ${strengthColor(computedScore)}`} style={{ width }} />
      </div>
    </div>
  );
}
