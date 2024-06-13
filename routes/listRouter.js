import express from 'express';
import * as listController from '../controllers/listController.js';

const router = express.Router();

router.post('/list', listController.createList);

router.get('/list/:id', listController.getList);

router.get('/list', listController.getAllLists);

router.put('/list/:id', listController.updateList);

router.delete('/list/:id', listController.deleteList);

export default router;