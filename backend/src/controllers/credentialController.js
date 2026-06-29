import Credential from '../models/Credential.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { decryptSecret, encryptSecret } from '../utils/crypto.js';
import { scorePassword } from '../utils/passwordStrength.js';

const mapCredential = (credential, includePassword = true) => ({
  id: credential._id,
  title: credential.title,
  username: credential.username,
  url: credential.url,
  password: includePassword ? decryptSecret(credential.encryptedPassword) : undefined,
  category: credential.category,
  favorite: credential.favorite,
  strengthScore: credential.strengthScore,
  passwordUpdatedAt: credential.passwordUpdatedAt,
  createdAt: credential.createdAt,
  updatedAt: credential.updatedAt
});

const getOwnedCredential = async (id, userId) => {
  const credential = await Credential.findOne({ _id: id, user: userId });

  if (!credential) {
    const error = new Error('Credential not found');
    error.statusCode = 404;
    throw error;
  }

  return credential;
};

export const listCredentials = asyncHandler(async (req, res) => {
  const { search, category, favorite } = req.query;
  const query = { user: req.user._id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } },
      { url: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (favorite === 'true') {
    query.favorite = true;
  }

  const credentials = await Credential.find(query).sort({ favorite: -1, updatedAt: -1 });

  res.json({
    credentials: credentials.map((credential) => mapCredential(credential))
  });
});

export const createCredential = asyncHandler(async (req, res) => {
  const { title, username, url, password, category, favorite } = req.body;

  if (!title || !password) {
    return res.status(400).json({ message: 'Title and password are required' });
  }

  const credential = await Credential.create({
    user: req.user._id,
    title,
    username,
    url,
    encryptedPassword: encryptSecret(password),
    category: category || 'Personal',
    favorite: Boolean(favorite),
    strengthScore: scorePassword(password),
    passwordUpdatedAt: new Date()
  });

  res.status(201).json({ credential: mapCredential(credential) });
});

export const getCredential = asyncHandler(async (req, res) => {
  const credential = await getOwnedCredential(req.params.id, req.user._id);
  res.json({ credential: mapCredential(credential) });
});

export const updateCredential = asyncHandler(async (req, res) => {
  const credential = await getOwnedCredential(req.params.id, req.user._id);
  const { title, username, url, password, category, favorite } = req.body;

  if (title !== undefined) credential.title = title;
  if (username !== undefined) credential.username = username;
  if (url !== undefined) credential.url = url;
  if (category !== undefined) credential.category = category || 'Personal';
  if (favorite !== undefined) credential.favorite = Boolean(favorite);

  if (password) {
    credential.encryptedPassword = encryptSecret(password);
    credential.strengthScore = scorePassword(password);
    credential.passwordUpdatedAt = new Date();
  }

  await credential.save();

  res.json({ credential: mapCredential(credential) });
});

export const deleteCredential = asyncHandler(async (req, res) => {
  const credential = await getOwnedCredential(req.params.id, req.user._id);

  await credential.deleteOne();

  res.json({ message: 'Credential deleted' });
});

export const revealPassword = asyncHandler(async (req, res) => {
  const credential = await getOwnedCredential(req.params.id, req.user._id);
  res.json({ password: decryptSecret(credential.encryptedPassword) });
});
