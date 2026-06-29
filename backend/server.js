import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(port, () => {
    console.log(`SecureVault Pro API running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start API server:', error);
  process.exit(1);
});
