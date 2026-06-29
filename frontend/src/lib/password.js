const groups = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{};:,.<>?'
};

export const generatePassword = ({
  length = 18,
  uppercase = true,
  lowercase = true,
  numbers = true,
  symbols = true
} = {}) => {
  const enabledGroups = [
    uppercase && groups.uppercase,
    lowercase && groups.lowercase,
    numbers && groups.numbers,
    symbols && groups.symbols
  ].filter(Boolean);

  const alphabet = enabledGroups.join('') || groups.lowercase;
  const password = [];

  enabledGroups.forEach((group) => {
    password.push(group[Math.floor(Math.random() * group.length)]);
  });

  while (password.length < length) {
    password.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return password.sort(() => Math.random() - 0.5).join('');
};

export const scorePassword = (password = '') => {
  let score = 0;

  if (password.length >= 10) score += 1;
  if (password.length >= 14) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return Math.min(score, 4);
};

export const strengthLabel = (score) => {
  if (score <= 1) return 'Weak';
  if (score <= 3) return 'Medium';
  return 'Strong';
};

export const strengthColor = (score) => {
  if (score <= 1) return 'bg-rose-500';
  if (score <= 3) return 'bg-amber-500';
  return 'bg-emerald-500';
};
