import express from 'express';
import {
  createCredential,
  deleteCredential,
  getCredential,
  listCredentials,
  revealPassword,
  updateCredential
} from '../controllers/credentialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', listCredentials);
router.post('/', createCredential);
router.get('/:id', getCredential);
router.patch('/:id', updateCredential);
router.delete('/:id', deleteCredential);
router.post('/:id/reveal', revealPassword);

export default router;
