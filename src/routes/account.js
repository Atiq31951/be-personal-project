// accountRoutes.js
import express from 'express';
import accountController from '../controllers/accountController.js';

const router = express.Router();

router.post('/create', accountController.createAccount);
router.put('/:id/update', accountController.updateAccount);
router.delete('/:id/delete', accountController.deleteAccount);
// Other account routes...

export default router;
