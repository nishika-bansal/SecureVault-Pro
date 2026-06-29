import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { createJwt, sanitizeUser } from '../utils/tokens.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isStrongEnough = (password = '') =>
  password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

const buildAuthResponse = (user) => ({
  token: createJwt(user),
  user: sanitizeUser(user)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  if (!isStrongEnough(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include one uppercase letter and one number'
    });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'An account already exists for this email' });
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    lastLoginAt: new Date()
  });

  res.status(201).json(buildAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() });

  if (!user || !(await user.comparePassword(password || ''))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  res.json(buildAuthResponse(user));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ message: 'Logged out securely' });
});
