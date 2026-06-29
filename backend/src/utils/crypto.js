import crypto from 'crypto';

const getEncryptionKey = () => {
  const configuredKey = process.env.ENCRYPTION_KEY;

  if (!configuredKey) {
    return crypto.createHash('sha256').update('securevault-pro-local-dev-key').digest();
  }

  const base64Key = Buffer.from(configuredKey, 'base64');
  if (base64Key.length === 32) {
    return base64Key;
  }

  return crypto.createHash('sha256').update(configuredKey).digest();
};

export const encryptSecret = (plainText = '') => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join(':');
};

export const decryptSecret = (payload = '') => {
  if (!payload) {
    return '';
  }

  const [ivValue, tagValue, encryptedValue] = payload.split(':');

  if (!ivValue || !tagValue || !encryptedValue) {
    throw new Error('Encrypted value is malformed');
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivValue, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tagValue, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64')),
    decipher.final()
  ]).toString('utf8');
};
